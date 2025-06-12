import { Injectable } from '@nestjs/common';
import { MetricsCalculationService } from './metrics-calculations/metrics-calculations.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@Injectable()
export class MetricsService {
  constructor(private readonly calculations: MetricsCalculationService) {}

  async getDashboardData(): Promise<DashboardResponseDto> {
    return {
      withdrawalsByCourse: await this.calculations.getWithdrawalsByCourse(),
      mostFrequentDiscipline:
        await this.calculations.getMostFrequentDiscipline(),
      averageUsageTime: await this.calculations.getAverageUsageTime(),
      medianUsageTime: await this.calculations.getMedianUsageTime(),
      withdrawalsByPeriod: await this.calculations.getWithdrawalsByPeriod(),
      top5LongestAverageUsage:
        await this.calculations.getTop5LongestAverageUsage(),
      usageTimeStdDev: await this.calculations.getUsageTimeStandardDeviation(),
      normalDistribution: await this.calculations.getNormalDistribution(),
      withdrawalForecast: await this.calculations.getWithdrawalForecast(),
      dailyWithdrawalsLastWeek:
        await this.calculations.getDailyWithdrawalsLastWeek(),
      unreturnedNotebooks: await this.calculations.getUnreturnedNotebooks(),
      usageTimeSkewness: await this.calculations.getUsageTimeSkewness(),
    };
  }
}
