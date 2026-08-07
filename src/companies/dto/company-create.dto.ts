import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CompanyCreateDto {
  @ApiProperty({
    example: 'Google',
    description: 'Company name',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'https://google.com',
    description: 'Company website',
  })
  @IsOptional()
  @IsUrl()
  website?: string;
}
