import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { VacanciesCreateDto, VacanciesUpdateDto } from './dto';

@Injectable()
export class VacanciesService {
  constructor(private prismaClient: PrismaService) {}

  async findAll(userId: number) {
    return await this.prismaClient.vacancy.findMany({
      where: {
        company: {
          userId,
        },
      },
      include: {
        company: true,
      },
    });
  }

  async findOne(id: number, userId: number) {
    const vacancy = await this.prismaClient.vacancy.findFirst({
      where: {
        id,
        company: {
          userId,
        },
      },
      include: {
        company: true,
      },
    });

    if (!vacancy) {
      throw new NotFoundException('Vacancy not found');
    }

    return vacancy;
  }

  async findHistory(vacancyId: number, userId: number) {
    const vacancy = await this.prismaClient.vacancy.findFirst({
      where: {
        id: vacancyId,
        company: {
          userId,
        },
      },
    });

    if (!vacancy) {
      throw new NotFoundException('Vacancy not found');
    }

    return this.prismaClient.vacancyHistory.findMany({
      where: {
        vacancyId,
      },
      orderBy: {
        changedAt: 'desc',
      },
    });
  }

  async update(id: number, data: VacanciesUpdateDto, userId: number) {
    const vacancy = await this.prismaClient.vacancy.findFirst({
      where: {
        id,
        company: {
          userId,
        },
      },
    });

    if (!vacancy) {
      throw new NotFoundException('Vacancy not found');
    }

    return this.prismaClient.$transaction(async (tx) => {
      if (data.status && data.status !== vacancy.status) {
        await tx.vacancyHistory.create({
          data: {
            oldStatus: vacancy.status,
            newStatus: data.status,
            vacancyId: vacancy.id,
          },
        });
      }

      return tx.vacancy.update({
        where: {
          id,
        },
        data,
      });
    });
  }

  async create(data: VacanciesCreateDto, userId: number) {
    const company = await this.prismaClient.company.findFirst({
      where: {
        id: data.companyId,
        userId,
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return this.prismaClient.vacancy.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async delete(id: number, userId: number) {
    const vacancy = await this.prismaClient.vacancy.findFirst({
      where: {
        id,
        company: {
          userId,
        },
      },
    });

    if (!vacancy) {
      throw new NotFoundException('Vacancy not found');
    }

    return await this.prismaClient.vacancy.delete({
      where: {
        id,
      },
    });
  }
}
