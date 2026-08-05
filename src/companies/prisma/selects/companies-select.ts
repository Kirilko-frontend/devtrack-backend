import { Prisma } from '@prisma/client';

export const companySelect = {
  id: true,
  name: true,
  website: true,
  createdAt: true,
} satisfies Prisma.CompanySelect;
