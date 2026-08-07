import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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

import { CompaniesService } from './companies.service';
import { CompanyCreateDto, CompanyResponseDto, CompanyUpdateDto } from './dto';

@ApiTags('Companies')
@ApiBearerAuth()
@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all companies',
  })
  @ApiResponse({
    status: 200,
    description: 'Companies successfully returned',
    type: [CompanyResponseDto],
  })
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get company by id',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Company found',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create company',
  })
  @ApiResponse({
    status: 201,
    description: 'Company created',
    type: CompanyResponseDto,
  })
  create(@Body() data: CompanyCreateDto) {
    return this.companiesService.create(data);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update company',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Company updated',
    type: CompanyResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CompanyUpdateDto,
  ) {
    return this.companiesService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete company',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Company deleted',
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.delete(id);
  }
}
