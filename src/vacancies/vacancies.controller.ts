import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
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

import { VacanciesService } from './vacancies.service';
import { VacancyCreateDto, VacancyResponseDto, VacancyUpdateDto } from './dto';

@ApiTags('Vacancies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vacancies')
export class VacanciesController {
  constructor(private vacanciesService: VacanciesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all vacancies',
    description: 'Returns all vacancies belonging to current user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Vacancies successfully returned.',
    type: [VacancyResponseDto],
  })
  findAll(@Request() req) {
    return this.vacanciesService.findAll(req.user.id);
  }

  @Get(':id/history')
  @ApiOperation({
    summary: 'Get vacancy history',
    description: 'Returns status change history of vacancy.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Vacancy id',
  })
  @ApiResponse({
    status: 200,
    description: 'Vacancy history successfully returned.',
  })
  @ApiResponse({
    status: 404,
    description: 'Vacancy not found.',
  })
  getHistory(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vacanciesService.findHistory(id, req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get vacancy by id',
    description: 'Returns one vacancy belonging to current user.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Vacancy id',
  })
  @ApiResponse({
    status: 200,
    description: 'Vacancy successfully found.',
    type: VacancyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Vacancy not found.',
  })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vacanciesService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create vacancy',
    description: 'Creates a new vacancy for current user.',
  })
  @ApiResponse({
    status: 201,
    description: 'Vacancy successfully created.',
    type: VacancyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found.',
  })
  create(@Body() data: VacancyCreateDto, @Request() req) {
    return this.vacanciesService.create(data, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update vacancy',
    description: 'Updates vacancy information or status.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Vacancy id',
  })
  @ApiResponse({
    status: 200,
    description: 'Vacancy successfully updated.',
    type: VacancyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Vacancy not found.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: VacancyUpdateDto,
    @Request() req,
  ) {
    return this.vacanciesService.update(id, data, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete vacancy',
    description: 'Deletes vacancy belonging to current user.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Vacancy id',
  })
  @ApiResponse({
    status: 200,
    description: 'Vacancy successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Vacancy not found.',
  })
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vacanciesService.delete(id, req.user.id);
  }
}
