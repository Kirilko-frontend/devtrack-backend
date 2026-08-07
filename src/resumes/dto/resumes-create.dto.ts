import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ResumeCreateDto {
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
  @IsInt()
  vacancyId?: number;
}
