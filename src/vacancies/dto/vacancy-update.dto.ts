export enum VacancyStatus {
  applied = 'APPLIED',
  interviewing = 'INTERVIEWING',
  offered = 'OFFERED',
  rejected = 'REJECTED',
  saved = 'SAVED',
}


export class VacancyUpdateDto {
  title?: string;
  description?: string;
  salary?: string;
  status?: VacancyStatus;
  companyId?: number;
}
