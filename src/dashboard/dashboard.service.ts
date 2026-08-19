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
      statsChanges,
      recentVacancies,
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

      this.getStatsChanges(userId),

      this.prisma.vacancy.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        select: {
          id: true,
          title: true,
          url: true,
          salary: true,
          status: true,
          createdAt: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
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

      statsChanges,

      vacancyStatuses: {
        saved: savedVacancies,
        applied: appliedVacancies,
        interviewing: interviewingVacancies,
        offered: offeredVacancies,
        rejected: rejectedVacancies,
      },

      upcomingInterviews,

      applicationActivity,

      recentVacancies,
    };
  }

  private async getStatsChanges(userId: number) {
    const now = new Date();

    const currentPeriodStart = new Date(now);
    currentPeriodStart.setDate(now.getDate() - 7);

    const previousPeriodStart = new Date(now);
    previousPeriodStart.setDate(now.getDate() - 14);

    const [current, previous] = await Promise.all([
      this.getPeriodStats(userId, currentPeriodStart, now),
      this.getPeriodStats(userId, previousPeriodStart, currentPeriodStart),
    ]);

    return {
      vacancies: this.calculateChange(current.vacancies, previous.vacancies),
      companies: this.calculateChange(current.companies, previous.companies),
      interviews: this.calculateChange(current.interviews, previous.interviews),
      resumes: this.calculateChange(current.resumes, previous.resumes),
    };
  }

  private async getPeriodStats(userId: number, startDate: Date, endDate: Date) {
    const [vacancies, companies, interviews, resumes] = await Promise.all([
      this.prisma.vacancy.count({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      }),

      this.prisma.company.count({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      }),

      this.prisma.interview.count({
        where: {
          date: {
            gte: startDate,
            lt: endDate,
          },
          vacancy: {
            userId,
          },
        },
      }),

      this.prisma.resume.count({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      }),
    ]);

    return {
      vacancies,
      companies,
      interviews,
      resumes,
    };
  }

  private calculateChange(current: number, previous: number) {
    if (previous === 0) {
      return current === 0 ? 0 : 100;
    }

    return Math.round(((current - previous) / previous) * 100);
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