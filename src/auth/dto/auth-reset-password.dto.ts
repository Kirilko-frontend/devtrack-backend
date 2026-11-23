import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthResetPasswordDto {
  @ApiProperty({
    description: 'Token from the password reset link',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: '123456',
    description: 'New password',
    minLength: 6,
  })
  @MinLength(6)
  password: string;
}
