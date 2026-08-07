import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class UserCreateDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'User email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'User password',
    minLength: 6,
  })
  @MinLength(6)
  password: string;
}
