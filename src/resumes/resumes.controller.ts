import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import type { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiErrors } from 'src/common/swagger/api-errors.decorator';

import { ResumesService } from './resumes.service';

import { ResumesCreateDto, ResumesUpdateDto, ResumesResponseDto } from './dto';

@ApiTags('Resumes')
@ApiBearerAuth()
@ApiErrors()
@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(private resumesService: ResumesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all resumes',
    description: 'Returns resumes belonging to current user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Resumes successfully returned.',
    type: [ResumesResponseDto],
  })
  findAll(@Request() req) {
    return this.resumesService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get resume by id',
    description: 'Returns one resume.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Resume successfully found.',
    type: ResumesResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Resume not found.',
  })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.resumesService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create resume',
    description: 'Creates a new resume.',
  })
  @ApiResponse({
    status: 201,
    description: 'Resume successfully created.',
    type: ResumesResponseDto,
  })
  create(@Body() data: ResumesCreateDto, @Request() req) {
    return this.resumesService.create(data, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update resume',
    description: 'Updates resume data.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Resume successfully updated.',
    type: ResumesResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Resume not found.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ResumesUpdateDto,
    @Request() req,
  ) {
    return this.resumesService.update(id, data, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete resume',
    description: 'Deletes resume.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Resume successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Resume not found.',
  })
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.resumesService.delete(id, req.user.id);
  }

  @Post('upload')
  @ApiOperation({
    summary: 'Upload resume file',
    description: 'Uploads resume file and creates resume record.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },

        name: {
          type: 'string',
          example: 'Frontend Developer CV',
        },

        vacancyId: {
          type: 'number',
          example: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Resume uploaded successfully.',
    type: ResumesResponseDto,
  })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: ResumesCreateDto,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.resumesService.create(
      {
        ...data,
        filePath: file.path,
      },
      req.user.id,
    );
  }

  @Get(':id/file')
  @ApiOperation({
    summary: 'Download resume file',
    description: 'Returns resume file.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'File successfully returned.',
  })
  @ApiResponse({
    status: 404,
    description: 'Resume not found.',
  })
  getFile(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Res() res: Response,
  ) {
    return this.resumesService.getFile(id, req.user.id, res);
  }
}
