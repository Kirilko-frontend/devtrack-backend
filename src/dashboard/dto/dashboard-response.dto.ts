import { ApiProperty } from '@nestjs/swagger';

export class DashboardResponseDto {
  @ApiProperty({
    example: 10,
    description: 'Total vacancies created by user',
  })
  totalVacancies: number;

  @ApiProperty({
    example: 5,
    description: 'Total companies owned by user vacancies',
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
