import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { InterviewsService } from './interviews.service';
import {
  InterviewsCreateDto,
  InterviewsUpdateDto,
  InterviewResponseDto,
} from './dto';

@ApiTags('Interviews')
@ApiBearerAuth()
@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all interviews',
    description: 'Returns all interviews of current user vacancies.',
  })
  @ApiResponse({
    status: 200,
    description: 'Interviews successfully returned.',
    type: [InterviewResponseDto],
  })
  findAll(@Request() req) {
    return this.interviewsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get interview by id',
    description: 'Returns one interview.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Interview successfully found.',
    type: InterviewResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Interview not found.',
  })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.interviewsService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create interview',
    description: 'Creates interview for user vacancy.',
  })
  @ApiResponse({
    status: 201,
    description: 'Interview successfully created.',
    type: InterviewResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Vacancy not found.',
  })
  create(@Body() data: InterviewsCreateDto, @Request() req) {
    return this.interviewsService.create(data, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update interview',
    description: 'Updates interview data.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Interview successfully updated.',
    type: InterviewResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Interview not found.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: InterviewsUpdateDto,
    @Request() req,
  ) {
    return this.interviewsService.update(id, data, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete interview',
    description: 'Deletes interview.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Interview successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Interview not found.',
  })
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.interviewsService.delete(id, req.user.id);
  }
}
