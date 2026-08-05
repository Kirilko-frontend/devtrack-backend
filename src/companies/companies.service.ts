import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyCreateDto, CompanyUpdateDto } from './dto';
import { companySelect, vacancySelect } from './prisma/selects';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.company.findMany({
      select: companySelect,
    });
  }

  async findOne(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: { vacancies: { select: vacancySelect } },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  create(data: CompanyCreateDto) {
    return this.prisma.company.create({
      data,
    });
  }

  async update(id: number, data: CompanyUpdateDto) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return this.prisma.company.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: { vacancies: true },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.vacancies.length > 0) {
      throw new BadRequestException('Cannot delete company with vacancies');
    }

    return this.prisma.company.delete({
      where: { id },
    });
  }
}
