import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 1,
    description: 'User unique identifier',
  })
  id: number;

  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    example: '2026-08-06T09:36:45.773Z',
    description: 'User creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-08-06T10:00:00.000Z',
    description: 'User last update date',
  })
  updatedAt: Date;
}
