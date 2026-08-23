import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum VacancySort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
  TITLE = 'TITLE',
}

export enum VacancyStatusFilter {
  ALL = 'ALL',
  SAVED = 'SAVED',
  APPLIED = 'APPLIED',
  INTERVIEWING = 'INTERVIEWING',
  OFFERED = 'OFFERED',
  REJECTED = 'REJECTED',
}

export class VacanciesQueryDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    example: 'frontend',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: VacancyStatusFilter,
    default: VacancyStatusFilter.ALL,
  })
  @IsOptional()
  @IsEnum(VacancyStatusFilter)
  status?: VacancyStatusFilter;

  @ApiPropertyOptional({
    enum: VacancySort,
    default: VacancySort.NEWEST,
  })
  @IsOptional()
  @IsEnum(VacancySort)
  sort?: VacancySort;
}