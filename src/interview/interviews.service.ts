import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { PrismaService } from 'src/prisma/prisma.service';
import { InterviewsCreateDto, InterviewsUpdateDto } from './dto';

@Injectable()
@UseGuards(JwtAuthGuard)
export class InterviewsService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.interview.findMany({
      where: { vacancy: { userId } },
    });
  }

  async findOne(id: number, userId: number) {
    const interview = await this.prisma.interview.findFirst({
      where: { id, vacancy: { userId } },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    return interview;
  }

  async create(data: InterviewsCreateDto, userId: number) {
    const vacancy = await this.prisma.vacancy.findFirst({
      where: { id: data.vacancyId, userId },
    });

    if (!vacancy) {
      throw new NotFoundException('Vacancy not found');
    }

    return this.prisma.interview.create({
      data,
    });
  }

  async update(id: number, data: InterviewsUpdateDto, userId: number) {
    const interview = await this.prisma.interview.findFirst({
      where: { id, vacancy: { userId } },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    return this.prisma.interview.update({
      where: { id },
      data,
    });
  }

  async delete(id: number, userId: number) {
    const interview = await this.prisma.interview.findFirst({
      where: { id, vacancy: { userId } },
    });
    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    return this.prisma.interview.delete({
      where: { id },
    });
  }
}
