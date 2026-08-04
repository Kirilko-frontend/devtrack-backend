import { IsInt, IsOptional, IsString } from 'class-validator';

export class VacancyCreateDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  Url?: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsInt()
  companyId: number;
}
