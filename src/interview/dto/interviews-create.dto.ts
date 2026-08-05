import { InterviewType } from '@prisma/client';

import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class InterviewsCreateDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsEnum(InterviewType)
  types: InterviewType;

  @IsInt()
  vacancyId: number;
}
