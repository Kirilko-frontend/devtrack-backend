import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { clearAuthCookies } from 'src/auth/cookie-options';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiErrors } from 'src/common/swagger/api-errors.decorator';

import { UsersService } from './users.service';
import { UsersResponseDto, UsersUpdateDto } from './dto';

@ApiTags('Users')
@ApiBearerAuth()
@ApiErrors()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully returned.',
    type: UsersResponseDto,
  })
  findMe(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Update current user',
    description: 'Updates email and/or password of the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated.',
    type: UsersResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists.',
  })
  updateMe(@Body() data: UsersUpdateDto, @Request() req) {
    return this.usersService.update(req.user.id, data);
  }

  @Delete('me')
  @ApiOperation({
    summary: 'Delete current user',
    description: 'Deletes the authenticated user and all their data.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted.',
  })
  async deleteMe(@Request() req, @Res({ passthrough: true }) res: Response) {
    await this.usersService.delete(req.user.id);

    clearAuthCookies(res);

    return {
      message: 'User deleted',
    };
  }
}
