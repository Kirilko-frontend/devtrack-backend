import { PartialType } from '@nestjs/swagger';
import { InterviewsCreateDto } from './interviews-create.dto';

export class InterviewsUpdateDto extends PartialType(InterviewsCreateDto) {}
