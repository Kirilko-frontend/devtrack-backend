import { PartialType } from '@nestjs/mapped-types';
import { InterviewsCreateDto } from './interviews-create.dto';

export class InterviewsUpdateDto extends PartialType(InterviewsCreateDto) {}
