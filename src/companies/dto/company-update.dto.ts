import { PartialType } from '@nestjs/mapped-types';
import { CompanyCreateDto } from './company-create.dto';

export class CompanyUpdateDto extends PartialType(CompanyCreateDto) {}
