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
import { ApiErrors } from 'src/common/swagger/api-errors.decorator';

import { CompaniesService } from './companies.service';
import {
  CompaniesCreateDto,
  CompaniesResponseDto,
  CompaniesUpdateDto,
} from './dto';

@ApiTags('Companies')
@ApiBearerAuth()
@ApiErrors()
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
    type: [CompaniesResponseDto],
  })
  findAll(@Request() req) {
    return this.companiesService.findAll(req.user.id);
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
    type: CompaniesResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.companiesService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create company',
  })
  @ApiResponse({
    status: 201,
    description: 'Company created',
    type: CompaniesResponseDto,
  })
  create(@Body() data: CompaniesCreateDto, @Request() req) {
    return this.companiesService.create(data, req.user.id);
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
    type: CompaniesResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CompaniesUpdateDto,
    @Request() req,
  ) {
    return this.companiesService.update(id, data, req.user.id);
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
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.companiesService.delete(id, req.user.id);
  }
}
