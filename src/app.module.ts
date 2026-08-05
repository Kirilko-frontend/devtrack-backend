import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { CompaniesModule } from './companies/companies.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResumesModule } from './resumes/resumes.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    VacanciesModule,
    CompaniesModule,
    PrismaModule,
    ResumesModule,
  ],
})
export class AppModule {}
