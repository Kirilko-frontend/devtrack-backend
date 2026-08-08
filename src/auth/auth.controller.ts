import { Body, Controller, Post, Res } from '@nestjs/common';

import type { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrors } from 'src/common/swagger/api-errors.decorator';

import { AuthService } from './auth.service';
import { UsersResponseDto } from 'src/users/dto';
import { AuthLoginDto, AuthRegisterDto, AuthResponseDto } from './dto';

@ApiTags('Auth')
@ApiErrors()
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
    type: UsersResponseDto,
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
  async login(
    @Body() data: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(data);

    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Login successful',
    };
  }
}
