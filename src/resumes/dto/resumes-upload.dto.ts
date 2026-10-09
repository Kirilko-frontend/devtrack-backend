import { OmitType } from '@nestjs/swagger';

import { ResumesCreateDto } from './resumes-create.dto';

export class ResumesUploadDto extends OmitType(ResumesCreateDto, ['filePath'] as const) {}
