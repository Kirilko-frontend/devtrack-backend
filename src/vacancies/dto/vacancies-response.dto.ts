import { ApiProperty } from '@nestjs/swagger';
import { VacancyStatus } from '@prisma/client';

export class VacanciesResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'Frontend Developer',
  })
  title: string;

  @ApiProperty({
    example: 'React position',
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    example: '3000-5000 USD',
    nullable: true,
  })
  salary?: string;

  @ApiProperty({
    enum: VacancyStatus,
    example: VacancyStatus.SAVED,
  })
  status: VacancyStatus;

  @ApiProperty({
    example: 1,
  })
  userId: number;

  @ApiProperty({
    example: 1,
  })
  companyId: number;

  @ApiProperty()
  createdAt: Date;
}
