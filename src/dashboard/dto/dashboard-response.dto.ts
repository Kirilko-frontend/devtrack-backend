import { ApiProperty } from '@nestjs/swagger';
import { InterviewType } from '@prisma/client';

class DashboardStatsDto {
  @ApiProperty({
    example: 10,
    description: 'Total vacancies created by user',
  })
  totalVacancies: number;

  @ApiProperty({
    example: 5,
    description: 'Total companies owned by user',
  })
  totalCompanies: number;

  @ApiProperty({
    example: 3,
    description: 'Total interviews connected to user vacancies',
  })
  totalInterviews: number;

  @ApiProperty({
    example: 7,
    description: 'Total resumes created by user',
  })
  totalResumes: number;
}

class DashboardVacancyStatusesDto {
  @ApiProperty({ example: 8 })
  saved: number;

  @ApiProperty({ example: 10 })
  applied: number;

  @ApiProperty({ example: 4 })
  interviewing: number;

  @ApiProperty({ example: 2 })
  offered: number;

  @ApiProperty({ example: 6 })
  rejected: number;
}

class DashboardInterviewCompanyDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'Google',
  })
  name: string;
}

class DashboardInterviewVacancyDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'Frontend Developer',
  })
  title: string;

  @ApiProperty({
    type: DashboardInterviewCompanyDto,
  })
  company: DashboardInterviewCompanyDto;
}

class DashboardInterviewDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: '2026-08-15T14:00:00.000Z',
  })
  date: Date;

  @ApiProperty({
    enum: InterviewType,
    example: InterviewType.TECHNICAL,
  })
  types: InterviewType;

  @ApiProperty({
    type: DashboardInterviewVacancyDto,
  })
  vacancy: DashboardInterviewVacancyDto;
}

export class DashboardResponseDto {
  @ApiProperty({
    type: DashboardStatsDto,
  })
  stats: DashboardStatsDto;

  @ApiProperty({
    type: DashboardVacancyStatusesDto,
  })
  vacancyStatuses: DashboardVacancyStatusesDto;

  @ApiProperty({
    type: [DashboardInterviewDto],
    description: 'Five nearest upcoming interviews',
  })
  upcomingInterviews: DashboardInterviewDto[];
}
