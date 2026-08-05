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
import { CompaniesService } from './companies.service';
import { CompanyCreateDto, CompanyUpdateDto } from './dto';

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.findOne(id);
  }

  @Post()
  create(@Body() data: CompanyCreateDto) {
    return this.companiesService.create(data);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CompanyUpdateDto,
  ) {
    return this.companiesService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.delete(id);
  }
}
