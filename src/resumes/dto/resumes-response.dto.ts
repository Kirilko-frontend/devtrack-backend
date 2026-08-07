import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResumesResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Resume id',
  })
  id: number;

  @ApiProperty({
    example: 'Frontend Developer Resume',
    description: 'Resume name',
  })
  name: string;

  @ApiProperty({
    example: 'uploads/resumes/cv.pdf',
    description: 'Resume file path',
  })
  filePath: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Related vacancy id',
  })
  vacancyId?: number;

  @ApiProperty({
    example: 11,
    description: 'Owner user id',
  })
  userId: number;

  @ApiProperty({
    example: '2026-08-07T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-08-07T10:00:00.000Z',
  })
  updatedAt: Date;
}
