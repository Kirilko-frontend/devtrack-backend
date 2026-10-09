import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ResumesCreateDto {
  @ApiProperty({
    example: 'Frontend Developer Resume',
    description: 'Resume name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'uploads/resumes/cv.pdf',
    description: 'Path to uploaded resume file',
  })
  @IsString()
  @IsNotEmpty()
  filePath: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Related vacancy id',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  vacancyId?: number;
}
