import { IsEmail, MinLength } from 'class-validator';

export class UserCreateDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
