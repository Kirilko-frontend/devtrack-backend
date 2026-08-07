import { PartialType } from '@nestjs/swagger';
import { CompaniesCreateDto } from './companies-create.dto';

export class CompaniesUpdateDto extends PartialType(CompaniesCreateDto) {}
