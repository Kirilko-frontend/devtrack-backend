import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: 'uploads/resumes',
    }),
  ],
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule {}
