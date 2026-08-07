import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class VacancyCreateDto {
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

  @ApiProperty({
    example: 1,
    description: 'Company id',
  })
  @IsInt()
  companyId: number;
}
