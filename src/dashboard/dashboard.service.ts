import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: number) {
    const [
      totalVacancies,
      totalCompanies,
      totalInterviews,
      totalResumes,
      savedVacancies,
      appliedVacancies,
      interviewingVacancies,
      offeredVacancies,
      rejectedVacancies,
    ] = await Promise.all([
      this.prisma.vacancy.count({
        where: { userId },
      }),

      this.prisma.company.count({
        where: { userId },
      }),

      this.prisma.interview.count({
        where: {
          vacancy: {
            userId,
          },
        },
      }),

      this.prisma.resume.count({
        where: { userId },
      }),

      this.prisma.vacancy.count({
        where: {
          userId,
          status: 'SAVED',
        },
      }),

      this.prisma.vacancy.count({
        where: {
          userId,
          status: 'APPLIED',
        },
      }),

      this.prisma.vacancy.count({
        where: {
          userId,
          status: 'INTERVIEWING',
        },
      }),

      this.prisma.vacancy.count({
        where: {
          userId,
          status: 'OFFERED',
        },
      }),

      this.prisma.vacancy.count({
        where: {
          userId,
          status: 'REJECTED',
        },
      }),
    ]);

    return {
      stats: {
        totalVacancies,
        totalCompanies,
        totalInterviews,
        totalResumes,
      },

      vacancyStatuses: {
        saved: savedVacancies,
        applied: appliedVacancies,
        interviewing: interviewingVacancies,
        offered: offeredVacancies,
        rejected: rejectedVacancies,
      },
    };
  }
}
