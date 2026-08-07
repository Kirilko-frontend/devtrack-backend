import { Body, Controller, Post } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthLoginDto, AuthRegisterDto, AuthResponseDto } from './dto';
import { UserResponseDto } from 'src/users/dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register new user',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists',
  })
  register(@Body() data: AuthRegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns JWT token',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  login(@Body() data: AuthLoginDto) {
    return this.authService.login(data);
  }
}
