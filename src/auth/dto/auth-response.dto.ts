import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...',
    description: 'JWT access token',
  })
  access_token: string;
}
