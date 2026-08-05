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

import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { ResumesService } from './resumes.service';
import { ResumeCreateDto, ResumeUpdateDto } from './dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(private resumesService: ResumesService) {}

  @Get()
  findAll(@Request() req) {
    return this.resumesService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.resumesService.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() data: ResumeCreateDto, @Request() req) {
    return this.resumesService.create(data, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ResumeUpdateDto,
    @Request() req,
  ) {
    return this.resumesService.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.resumesService.delete(id, req.user.id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: ResumeCreateDto,
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
  getFile(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Res() res: Response,
  ) {
    return this.resumesService.getFile(id, req.user.id, res);
  }
}
