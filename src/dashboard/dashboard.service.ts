import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: number) {
    const [
      stats,
      vacancyStatuses,
      upcomingInterviews,
      applicationHistory,
      statsChanges,
      recentVacancies,
    ] = await Promise.all([
      this.getStats(userId),
      this.getVacancyStatuses(userId),
      this.getUpcomingInterviews(userId),
      this.getApplicationHistory(userId),
      this.getStatsChanges(userId),
      this.getRecentVacancies(userId),
    ]);

    const applicationActivity = this.groupApplicationsByDay(applicationHistory);

    return {
      stats,
      statsChanges,
      vacancyStatuses,
      upcomingInterviews,
      applicationActivity,
      recentVacancies,
    };
  }

  /**
   * Total numbers displayed in dashboard cards.
   */
  private async getStats(userId: number) {
    const [vacancies, companies, interviews, resumes] = await Promise.all([
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
    ]);

    return {
      totalVacancies: vacancies,
      totalCompanies: companies,
      totalInterviews: interviews,
      totalResumes: resumes,
    };
  }

  /**
   * Number of vacancies for each status.
   */
  private async getVacancyStatuses(userId: number) {
    const [saved, applied, interviewing, offered, rejected] = await Promise.all(
      [
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
      ],
    );

    return {
      saved,
      applied,
      interviewing,
      offered,
      rejected,
    };
  }

  /**
   * Next five interviews.
   */
  private async getUpcomingInterviews(userId: number) {
    return this.prisma.interview.findMany({
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
    });
  }

  /**
   * Application history used for the activity chart.
   */
  private async getApplicationHistory(userId: number) {
    return this.prisma.vacancy.findMany({
      where: {
        userId,
        appliedAt: {
          not: null,
        },
      },
      orderBy: {
        appliedAt: 'asc',
      },
      select: {
        appliedAt: true,
      },
    });
  }

  /**
   * Vacancies displayed in the "Recent vacancies" table.
   */
  private async getRecentVacancies(userId: number) {
    return this.prisma.vacancy.findMany({
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
        appliedAt: true,
        createdAt: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Changes for dashboard statistics.
   *
   * Current period: last 7 days.
   * Previous period: 7 days before that.
   */
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

  /**
   * Statistics for a specific time period.
   */
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

  /**
   * Calculates percentage change between two values.
   */
  private calculateChange(current: number, previous: number) {
    if (previous === 0) {
      return current === 0 ? 0 : 100;
    }

    return Math.round(((current - previous) / previous) * 100);
  }

  /**
   * Groups application history by day.
   */
  private groupApplicationsByDay(applications: { appliedAt: Date | null }[]) {
    const grouped = new Map<string, number>();

    for (const application of applications) {
      if (!application.appliedAt) {
        continue;
      }

      const date = application.appliedAt.toISOString().split('T')[0];

      grouped.set(date, (grouped.get(date) ?? 0) + 1);
    }

    return Array.from(grouped.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }
}
