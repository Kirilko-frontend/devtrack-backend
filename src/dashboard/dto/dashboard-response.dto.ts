import { ApiProperty } from '@nestjs/swagger';

export class DashboardResponseDto {
  @ApiProperty({
    example: 5,
    description: 'Total companies count',
  })
  companies: number;

  @ApiProperty({
    example: 10,
    description: 'Total vacancies count',
  })
  vacancies: number;

  @ApiProperty({
    example: 3,
    description: 'Total interviews count',
  })
  interviews: number;

  @ApiProperty({
    example: 4,
    description: 'Total resumes count',
  })
  resumes: number;
}
