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
  Req,
} from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { InterviewsCreateDto, InterviewsUpdateDto } from './dto';

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Get()
  findAll(@Request() req) {
    return this.interviewsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.interviewsService.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() data: InterviewsCreateDto, @Request() req) {
    return this.interviewsService.create(data, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: InterviewsUpdateDto,
    @Request() req,
  ) {
    return this.interviewsService.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.interviewsService.delete(id, req.user.id);
  }
}
