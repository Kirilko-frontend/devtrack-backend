import { Controller, Get, Request, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiErrors } from 'src/common/swagger/api-errors.decorator';

import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@ApiErrors()
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Get dashboard statistics',
    description: 'Returns statistics of current user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard successfully returned.',
    type: DashboardResponseDto,
  })
  getDashboard(@Request() req) {
    return this.dashboardService.getDashboard(req.user.id);
  }
}
