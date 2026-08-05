import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: number) {
    const totalVacancies = await this.prisma.vacancy.count({
      where: {
        userId,
      },
    });

    const totalCompanies = await this.prisma.company.count({
      where: {
        vacancies: {
          some: {
            userId,
          },
        },
      },
    });

    const totalInterviews = await this.prisma.interview.count({
      where: {
        vacancy: {
          userId,
        },
      },
    });

    const totalResumes = await this.prisma.resume.count({
      where: {
        userId,
      },
    });

    return {
      totalVacancies,
      totalCompanies,
      totalInterviews,
      totalResumes,
    };
  }
}
