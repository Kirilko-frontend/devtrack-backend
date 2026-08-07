import { PartialType } from '@nestjs/swagger';
import { UsersCreateDto } from './users-create.dto';

export class UsersUpdateDto extends PartialType(UsersCreateDto) {}
