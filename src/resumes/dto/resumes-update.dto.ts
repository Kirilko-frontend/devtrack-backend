import { PartialType } from '@nestjs/swagger';

import { ResumesCreateDto } from './resumes-create.dto';

export class ResumesUpdateDto extends PartialType(ResumesCreateDto) {}
