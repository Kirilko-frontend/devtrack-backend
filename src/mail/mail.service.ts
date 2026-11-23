import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
}

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

/**
 * Sends emails over HTTP (SMTP ports are blocked on Render free plan).
 *
 * - BREVO_API_KEY set: sends via Brevo (production).
 * - MAILPIT_URL set: sends to local Mailpit (development, UI on :8025).
 * - neither: logs the message in development, fails in production.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {}

  async send(message: MailMessage) {
    const brevoApiKey = this.configService.get<string>('BREVO_API_KEY');
    const mailpitUrl = this.configService.get<string>('MAILPIT_URL');

    if (brevoApiKey) {
      return this.sendViaBrevo(message, brevoApiKey);
    }

    if (mailpitUrl) {
      return this.sendViaMailpit(message, mailpitUrl);
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error('Email provider is not configured (BREVO_API_KEY)');
    }

    this.logger.warn(
      `Email provider is not configured. Email to ${message.to}:\n${message.text}`,
    );
  }

  private get sender() {
    return {
      email: this.configService.get<string>(
        'MAIL_FROM',
        'no-reply@devtrack.local',
      ),
      name: this.configService.get<string>('MAIL_FROM_NAME', 'DevTrack'),
    };
  }

  private async sendViaBrevo(message: MailMessage, apiKey: string) {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: this.sender,
        to: [{ email: message.to }],
        subject: message.subject,
        htmlContent: message.html,
        textContent: message.text,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Brevo responded with ${response.status}: ${await response.text()}`,
      );
    }
  }

  private async sendViaMailpit(message: MailMessage, mailpitUrl: string) {
    const { email, name } = this.sender;

    const response = await fetch(`${mailpitUrl}/api/v1/send`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        From: { Email: email, Name: name },
        To: [{ Email: message.to }],
        Subject: message.subject,
        HTML: message.html,
        Text: message.text,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Mailpit responded with ${response.status}: ${await response.text()}`,
      );
    }
  }
}
