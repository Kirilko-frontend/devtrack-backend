import { Injectable, NotFoundException } from '@nestjs/common';
import { open } from 'fs/promises';
import { extname, join } from 'path';
import { Response } from 'express';

import { PrismaService } from 'src/prisma/prisma.service';
import { ResumesCreateDto, ResumesUpdateDto } from './dto';

async function getFileExtension(filePath: string) {
  const extension = extname(filePath);

  if (extension) {
    return extension;
  }

  const file = await open(filePath, 'r');

  try {
    const header = Buffer.alloc(5);
    const { bytesRead } = await file.read(header, 0, header.length, 0);

    if (bytesRead === header.length && header.toString('ascii') === '%PDF-') {
      return '.pdf';
    }
  } finally {
    await file.close();
  }

  return '';
}

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

  create(data: ResumesCreateDto, userId: number) {
    return this.prisma.resume.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: number, data: ResumesUpdateDto, userId: number) {
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

  async getFile(id: number, userId: number, res: Response) {
    const resume = await this.prisma.resume.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    const filePath = join(process.cwd(), resume.filePath);
    const extension = await getFileExtension(filePath);

    return res.download(filePath, `${resume.name}${extension}`);
  }
}
