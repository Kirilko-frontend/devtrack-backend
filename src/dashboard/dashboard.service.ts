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
      applicationHistory,
    ] = await Promise.all([
      this.prisma.vacancy.count({
        where: {
          userId,
        },
      }),

      this.prisma.company.count({
        where: {
          userId,
        },
      }),

      this.prisma.interview.count({
        where: {
          vacancy: {
            userId,
          },
        },
      }),

      this.prisma.resume.count({
        where: {
          userId,
        },
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

      this.prisma.vacancyHistory.findMany({
        where: {
          newStatus: 'APPLIED',
          vacancy: {
            userId,
          },
        },
        orderBy: {
          changedAt: 'asc',
        },
      }),
    ]);

    const applicationActivity = this.groupApplicationsByDay(applicationHistory);

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

      applicationActivity,
    };
  }

  private groupApplicationsByDay(history: { changedAt: Date }[]) {
    const grouped = new Map<string, number>();

    for (const item of history) {
      const date = item.changedAt.toISOString().split('T')[0];

      grouped.set(date, (grouped.get(date) ?? 0) + 1);
    }

    return Array.from(grouped.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }
}
