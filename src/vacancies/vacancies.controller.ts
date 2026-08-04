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

import { VacanciesService } from './vacancies.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { VacancyCreateDto, VacancyUpdateDto } from './dto';

@Controller('vacancies')
export class VacanciesController {
  constructor(private vacanciesService: VacanciesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    return this.vacanciesService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vacanciesService.findOne(id, req.user.id);
  }

  @Get(':id/history')
  @UseGuards(JwtAuthGuard)
  getHistory(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vacanciesService.findHistory(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() data: VacancyCreateDto, @Request() req) {
    return this.vacanciesService.create(data, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: VacancyUpdateDto,
    @Request() req,
  ) {
    return this.vacanciesService.update(id, data, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vacanciesService.delete(id, req.user.id);
  }
}
