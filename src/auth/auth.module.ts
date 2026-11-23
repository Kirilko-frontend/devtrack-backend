import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';

import { JwtStrategy } from './jwt.strategy';
import { PasswordResetService } from './password-reset.service';

@Module({
  imports: [
    UsersModule,
    MailModule,

    JwtModule.registerAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: configService.get<StringValue>('JWT_EXPIRES_IN', '15m'),
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, PasswordResetService, JwtStrategy],
})
export class AuthModule {}
