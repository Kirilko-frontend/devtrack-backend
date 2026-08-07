import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CompaniesCreateDto, CompaniesUpdateDto } from './dto';

import { companySelect, vacancySelect } from './prisma/selects';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.company.findMany({
      where: {
        userId,
      },
      select: companySelect,
    });
  }

  async findOne(id: number, userId: number) {
    const company = await this.prisma.company.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        vacancies: {
          select: vacancySelect,
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  create(data: CompaniesCreateDto, userId: number) {
    return this.prisma.company.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: number, data: CompaniesUpdateDto, userId: number) {
    const company = await this.prisma.company.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return this.prisma.company.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number, userId: number) {
    const company = await this.prisma.company.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        vacancies: true,
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.vacancies.length > 0) {
      throw new BadRequestException('Cannot delete company with vacancies');
    }

    return this.prisma.company.delete({
      where: {
        id,
      },
    });
  }
}
