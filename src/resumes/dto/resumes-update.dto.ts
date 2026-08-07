import { PartialType } from '@nestjs/swagger';

import { ResumeCreateDto } from './resumes-create.dto';

export class ResumeUpdateDto extends PartialType(ResumeCreateDto) {}
