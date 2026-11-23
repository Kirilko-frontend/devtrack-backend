import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { Request as ExpressRequest, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrors } from 'src/common/swagger/api-errors.decorator';

import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { UsersResponseDto } from 'src/users/dto';
import { AuthLoginDto, AuthRegisterDto } from './dto';
import {
  REFRESH_TOKEN_COOKIE,
  clearAuthCookies,
  setAuthCookies,
} from './cookie-options';

const getRefreshToken = (req: ExpressRequest): string | undefined =>
  req.cookies?.[REFRESH_TOKEN_COOKIE];

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
    description:
      'Sets access_token and refresh_token httpOnly cookies on success.',
  })
  @ApiResponse({
    status: 201,
    description: 'Login successful, auth cookies are set',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(
    @Body() data: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(data);

    setAuthCookies(res, tokens);

    return {
      message: 'Login successful',
    };
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Uses refresh_token cookie, rotates it and sets a new pair of auth cookies.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens successfully refreshed',
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token is missing, invalid or expired',
  })
  async refresh(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const tokens = await this.authService.refresh(getRefreshToken(req));

      setAuthCookies(res, tokens);
    } catch (error) {
      clearAuthCookies(res);

      throw error;
    }

    return {
      message: 'Token refreshed',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user successfully returned',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  me(@Request() req) {
    return req.user;
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout user',
    description: 'Revokes refresh token and clears auth cookies.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
  })
  async logout(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(getRefreshToken(req));

    clearAuthCookies(res);

    return {
      message: 'Logout successful',
    };
  }
}
