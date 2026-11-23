import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

import { generateToken, hashToken } from './token.utils';

const MINUTE_MS = 60 * 1000;

/** A new link is not sent if the previous one was requested less than a minute ago. */
const RESEND_COOLDOWN_MS = MINUTE_MS;

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);

  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  /**
   * Always resolves the same way, whether the email exists or not,
   * so the endpoint can't be used to find out who is registered.
   */
  async requestReset(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return;
    }

    const recentToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gt: new Date(Date.now() - RESEND_COOLDOWN_MS),
        },
      },
    });

    if (recentToken) {
      return;
    }

    const token = generateToken();
    const expiresInMinutes = Number(
      this.configService.get('PASSWORD_RESET_EXPIRES_MINUTES', 30),
    );

    await this.prisma.$transaction([
      this.prisma.passwordResetToken.deleteMany({
        where: {
          userId: user.id,
        },
      }),

      this.prisma.passwordResetToken.create({
        data: {
          tokenHash: hashToken(token),
          userId: user.id,
          expiresAt: new Date(Date.now() + expiresInMinutes * MINUTE_MS),
        },
      }),
    ]);

    // Not awaited: response time must not depend on whether the user exists.
    void this.sendResetEmail(user.email, token, expiresInMinutes).catch(
      (error: unknown) => {
        this.logger.error(
          `Failed to send password reset email`,
          error instanceof Error ? error.stack : String(error),
        );
      },
    );
  }

  async resetPassword(token: string, password: string) {
    const storedToken = await this.prisma.passwordResetToken.findUnique({
      where: {
        tokenHash: hashToken(token),
      },
    });

    const invalidLinkError = new BadRequestException(
      'Reset link is invalid or has expired',
    );

    if (!storedToken) {
      throw invalidLinkError;
    }

    // Consume the token first so the same link can't be used twice in parallel.
    const { count } = await this.prisma.passwordResetToken.deleteMany({
      where: {
        id: storedToken.id,
      },
    });

    if (count === 0 || storedToken.expiresAt < new Date()) {
      throw invalidLinkError;
    }

    // Hashes the password and revokes all refresh tokens (logs out every session).
    await this.usersService.update(storedToken.userId, { password });

    await this.prisma.passwordResetToken.deleteMany({
      where: {
        userId: storedToken.userId,
      },
    });
  }

  private async sendResetEmail(
    email: string,
    token: string,
    expiresInMinutes: number,
  ) {
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:5173',
    );

    const link = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

    await this.mailService.send({
      to: email,
      subject: 'Reset your DevTrack password',
      text: [
        'You requested a password reset for your DevTrack account.',
        '',
        `Open this link to set a new password (valid for ${expiresInMinutes} minutes):`,
        link,
        '',
        'If you did not request this, just ignore this email.',
      ].join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1f1f1f;">
          <h2 style="margin-bottom: 16px;">Reset your DevTrack password</h2>
          <p>You requested a password reset for your DevTrack account.</p>
          <p>
            <a href="${link}"
               style="display: inline-block; padding: 12px 24px; background: #f97316; color: #ffffff; text-decoration: none; border-radius: 8px;">
              Set a new password
            </a>
          </p>
          <p style="color: #6b6b6b; font-size: 14px;">
            The link is valid for ${expiresInMinutes} minutes.
            If you did not request this, just ignore this email.
          </p>
        </div>
      `,
    });
  }
}
