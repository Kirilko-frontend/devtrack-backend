import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { VacancyCreateDto, VacancyUpdateDto } from './dto';

@Injectable()
export class VacanciesService {
  constructor(private prismaClient: PrismaService) {}

  async findAll(userId: number) {
    return await this.prismaClient.vacancy.findMany({
      where: {
        userId,
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
        userId,
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
        userId,
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

  async update(id: number, data: VacancyUpdateDto, userId: number) {
    const vacancy = await this.prismaClient.vacancy.findFirst({
      where: {
        id,
        userId,
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

  async create(data: VacancyCreateDto, userId: number) {
    const company = await this.prismaClient.company.findUnique({
      where: {
        id: data.companyId,
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
        userId,
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
