import { Controller, Get, UseGuards } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@ApiTags('Dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('dashboard')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @ApiOperation({
    summary: 'Statistical data on movements',
    description:
      'Provides a set of data analysis on notebook movements to create a dashboard.',
  })
  @ApiResponse({
    status: 200,
    description: 'OK - Calculated data analysis',
    type: DashboardResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Unauthorized data access attempt',
    content: {
      'application/json': {
        examples: {
          loginUnauthorized: {
            summary: 'Unauthorized attempt to access data without logging in',
            value: {
              message: 'Unauthorized',
              statusCode: 401,
            },
          },
        },
      },
    },
  })
  @Get()
  async getDashboard() {
    return this.metricsService.getDashboardData();
  }
}
