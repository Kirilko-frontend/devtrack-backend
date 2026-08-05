import { PartialType } from '@nestjs/mapped-types';
import { ResumeCreateDto } from './resumes-create.dto';

export class ResumeUpdateDto extends PartialType(ResumeCreateDto) {}
