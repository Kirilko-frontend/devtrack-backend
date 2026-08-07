import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export enum VacancyStatus {
  SAVED = 'SAVED',
  APPLIED = 'APPLIED',
  INTERVIEWING = 'INTERVIEWING',
  OFFERED = 'OFFERED',
  REJECTED = 'REJECTED',
}

export class VacancyUpdateDto {
  @ApiPropertyOptional({
    example: 'Senior Frontend Developer',
    description: 'Vacancy title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'React + TypeScript position',
    description: 'Vacancy description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: '3000-5000 USD',
    description: 'Salary range',
  })
  @IsOptional()
  @IsString()
  salary?: string;

  @ApiPropertyOptional({
    example: 'INTERVIEWING',
    enum: VacancyStatus,
    description: 'Current vacancy status',
  })
  @IsOptional()
  @IsEnum(VacancyStatus)
  status?: VacancyStatus;

  @ApiPropertyOptional({
    example: 1,
    description: 'Company id',
  })
  @IsOptional()
  @IsInt()
  companyId?: number;
}
