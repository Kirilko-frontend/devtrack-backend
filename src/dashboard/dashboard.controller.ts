import { Controller, Get, Request } from '@nestjs/common';

import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  getDashboard(@Request() req) {
    return this.dashboardService.getDashboard(req.user.id);
  }
}
