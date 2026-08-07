import { ApiProperty } from '@nestjs/swagger';

export class CompaniesResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Company id',
  })
  id: number;

  @ApiProperty({
    example: 'Google',
    description: 'Company name',
  })
  name: string;

  @ApiProperty({
    example: 'https://google.com',
    description: 'Company website',
    required: false,
  })
  website?: string;

  @ApiProperty({
    example: '2026-08-06T10:00:00.000Z',
    description: 'Company creation date',
  })
  createdAt: Date;
}
