import { VacancyStatus } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import {
  VacanciesCreateDto,
  VacanciesQueryDto,
  VacanciesUpdateDto,
} from './dto';
import { VacancySort, VacancyStatusFilter } from './dto/vacancies-query-dto';

@Injectable()
export class VacanciesService {
  constructor(private prismaClient: PrismaService) {}

  async findAll(userId: number, query: VacanciesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();
    const status = query.status ?? VacancyStatusFilter.ALL;
    const sort = query.sort ?? VacancySort.NEWEST;

    const skip = (page - 1) * limit;

    const where = {
      company: {
        userId,
      },
      ...(status !== VacancyStatusFilter.ALL && {
        status,
      }),
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
          {
            company: {
              name: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          },
        ],
      }),
    };

    const orderBy =
      sort === VacancySort.OLDEST
        ? { createdAt: 'asc' as const }
        : sort === VacancySort.TITLE
          ? { title: 'asc' as const }
          : { createdAt: 'desc' as const };

    const [data, total] = await this.prismaClient.$transaction([
      this.prismaClient.vacancy.findMany({
        where,
        include: {
          company: true,
        },
        skip,
        take: limit,
        orderBy,
      }),

      this.prismaClient.vacancy.count({
        where,
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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
        status: VacancyStatus.APPLIED,
        appliedAt: data.appliedAt ? new Date(data.appliedAt) : new Date(),
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

    if (data.companyId && data.companyId !== vacancy.companyId) {
      const company = await this.prismaClient.company.findFirst({
        where: {
          id: data.companyId,
          userId,
        },
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }
    }

    const updateData = {
      ...data,
      appliedAt: data.appliedAt ? new Date(data.appliedAt) : undefined,
    };

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
        data: updateData,
        include: {
          company: true,
        },
      });
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
