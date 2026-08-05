import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResumeCreateDto, ResumeUpdateDto } from './dto';

@Injectable()
export class ResumesService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.resume.findMany({
      where: { userId },
    });
  }

  async findOne(id: number, userId) {
    const resume = await this.prisma.resume.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return resume;
  }

  create(data: ResumeCreateDto, userId: number) {
    return this.prisma.resume.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: number, data: ResumeUpdateDto, userId: number) {
    const resume = await this.prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return this.prisma.resume.update({
      where: { id },
      data,
    });
  }

  async delete(id: number, userId: number) {
    const resume = await this.prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return this.prisma.resume.delete({
      where: { id },
    });
  }
}
