import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class AuthForgotPasswordDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'Email to send the password reset link to',
  })
  @IsEmail()
  email: string;
}
