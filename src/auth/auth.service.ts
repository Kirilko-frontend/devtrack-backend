import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AuthLoginDto, AuthRegisterDto } from './dto';

export interface AuthTokens {
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async register(data: AuthRegisterDto) {
    const user = await this.userService.create({
      email: data.email,
      password: data.password,
    });

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async login(data: AuthLoginDto): Promise<AuthTokens> {
    const user = await this.userService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.refreshToken.deleteMany({
      where: {
        userId: user.id,
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return this.issueTokens(user.id, user.email);
  }

  /**
   * Validates refresh token, revokes it and issues a new token pair (rotation).
   */
  async refresh(refreshToken: string | undefined): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: {
        tokenHash: hashToken(refreshToken),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // deleteMany doesn't throw when the row is already gone,
    // so two parallel refreshes with the same token can't both succeed.
    const { count } = await this.prisma.refreshToken.deleteMany({
      where: {
        id: storedToken.id,
      },
    });

    if (count === 0 || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.issueTokens(storedToken.user.id, storedToken.user.email);
  }

  async logout(refreshToken: string | undefined) {
    if (!refreshToken) {
      return;
    }

    await this.prisma.refreshToken.deleteMany({
      where: {
        tokenHash: hashToken(refreshToken),
      },
    });
  }

  private async issueTokens(
    userId: number,
    email: string,
  ): Promise<AuthTokens> {
    const accessToken = this.jwtService.sign({
      sub: userId,
      email,
    });

    const { exp } = this.jwtService.decode<{ exp: number }>(accessToken);

    const refreshToken = randomBytes(48).toString('base64url');

    const refreshTokenDays = Number(
      this.configService.get('REFRESH_TOKEN_EXPIRES_DAYS', 7),
    );

    const refreshTokenExpiresAt = new Date(
      Date.now() + refreshTokenDays * DAY_MS,
    );

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(refreshToken),
        userId,
        expiresAt: refreshTokenExpiresAt,
      },
    });

    return {
      accessToken,
      accessTokenExpiresAt: new Date(exp * 1000),
      refreshToken,
      refreshTokenExpiresAt,
    };
  }
}
