import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { VacancyStatus } from '@prisma/client';

export class VacanciesCreateDto {
  @ApiProperty({
    example: 'Frontend Developer',
    description: 'Vacancy title',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'React developer position with TypeScript',
    description: 'Vacancy description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://linkedin.com/jobs/123',
    description: 'Vacancy url',
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({
    example: '2000-3000 USD',
    description: 'Salary range',
  })
  @IsOptional()
  @IsString()
  salary?: string;

  @ApiPropertyOptional({
    example: '2026-08-28',
    description: 'Date when the vacancy application was submitted',
  })
  @IsOptional()
  @IsDateString()
  appliedAt?: string;

  @ApiPropertyOptional({
    example: VacancyStatus.APPLIED,
    enum: VacancyStatus,
    description: 'Current vacancy status',
  })
  @IsOptional()
  @IsEnum(VacancyStatus)
  status?: VacancyStatus;

  @ApiProperty({
    example: 1,
    description: 'Company id',
  })
  @IsInt()
  companyId: number;
}