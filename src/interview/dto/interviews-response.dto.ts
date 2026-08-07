import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InterviewType } from '@prisma/client';

export class InterviewsResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Interview id',
  })
  id: number;

  @ApiProperty({
    example: '2026-08-12T10:00:00.000Z',
    description: 'Interview date',
  })
  date: Date;

  @ApiPropertyOptional({
    example: 'Discussed React experience',
    description: 'Interview notes',
  })
  notes?: string;

  @ApiProperty({
    enum: InterviewType,
    example: InterviewType.PHONE,
    description: 'Interview type',
  })
  types: InterviewType;

  @ApiProperty({
    example: 6,
    description: 'Related vacancy id',
  })
  vacancyId: number;

  @ApiProperty({
    example: '2026-08-07T10:00:00.000Z',
  })
  createdAt: Date;
}
