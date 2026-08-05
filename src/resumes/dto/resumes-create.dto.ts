import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ResumeCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  filePath: string;

  @IsOptional()
  @IsInt()
  vacancyId?: number;
}
