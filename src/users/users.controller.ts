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
import { ApiErrors } from 'src/common/swagger/api-errors.decorator';

import { UsersService } from './users.service';
import { UsersCreateDto, UsersResponseDto, UsersUpdateDto } from './dto';

@ApiTags('Users')
@ApiErrors()
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
    type: [UsersResponseDto],
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
    type: UsersCreateDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists.',
  })
  create(@Body() data: UsersCreateDto) {
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
    type: UsersResponseDto,
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
    type: UsersResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UsersUpdateDto) {
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
