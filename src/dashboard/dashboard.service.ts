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
      upcomingInterviews,
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

      this.prisma.interview.findMany({
        where: {
          date: {
            gte: new Date(),
          },
          vacancy: {
            userId,
          },
        },
        orderBy: {
          date: 'asc',
        },
        take: 5,
        include: {
          vacancy: {
            include: {
              company: true,
            },
          },
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

      upcomingInterviews,
    };
  }
}
