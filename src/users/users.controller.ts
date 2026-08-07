import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UserCreateDto, UserResponseDto, UserUpdateDto } from './dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all registered users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Users successfully returned.',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No users found.',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create user',
    description: 'Creates a new user.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
    type: UserCreateDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists.',
  })
  create(@Body() data: UserCreateDto) {
    return this.usersService.create(data);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id',
    description: 'Returns one user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully found.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Updates user data.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UserUpdateDto) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Deletes a user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
