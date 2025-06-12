import { ApiProperty } from '@nestjs/swagger';

export class DashboardResponseDto {
  @ApiProperty({
    description: 'Total number of withdrawals grouped by course',
    example: [
      { course: 'DSM', total: 13 },
      { course: 'ADS', total: 17 },
    ],
  })
  withdrawalsByCourse: {
    course: string;
    total: number;
  }[];

  @ApiProperty({
    description: 'Most frequent discipline that used a notebook',
    example: {
      disciplineName: 'Engenharia de Software III',
      dayOfDiscipline: 'Segunda',
      total: 12,
    },
  })
  mostFrequentDiscipline: {
    disciplineName: string;
    dayOfDiscipline: string;
    total: number;
  };

  @ApiProperty({
    description: 'Average usage time of the notebooks in minutes',
    example: 59.64,
  })
  averageUsageTime: number;

  @ApiProperty({
    description: 'Median usage time of the notebooks in minutes',
    example: 60,
  })
  medianUsageTime: number;

  @ApiProperty({
    description:
      'Total number of withdrawals grouped by period (e.g. morning, night)',
    example: [
      { period: 'Matutino', quantity: 15 },
      { period: 'Noturno', quantity: 9 },
    ],
  })
  withdrawalsByPeriod: {
    period: string;
    quantity: number;
  }[];

  @ApiProperty({
    description:
      'Top 5 notebooks with the longest average usage time (in minutes)',
    example: [
      {
        notebookName: 'Dell Precision 5530',
        averageUsageTimeMinutes: 94.5,
      },
      {
        notebookName: 'HP Pavilion 15',
        averageUsageTimeMinutes: 77.79,
      },
    ],
  })
  top5LongestAverageUsage: {
    notebookName: string;
    averageUsageTimeMinutes: number;
  }[];

  @ApiProperty({
    description: 'Standard deviation of the usage times (in minutes)',
    example: {
      standardDeviation: 36.7,
    },
  })
  usageTimeStdDev: {
    standardDeviation: number;
  };

  @ApiProperty({
    description:
      'Normal distribution of notebook usage time in minutes. Each entry shows the time interval (minutes), the probability of occurrence based on the probability density function (PDF), and the cumulative probability up to that point (CDF). Useful for understanding the statistical behavior of usage time.',
    example: [
      {
        x: 10,
        y: 0.004346,
        cumulative: 0.0869,
      },
      {
        x: 20,
        y: 0.006063,
        cumulative: 0.1401,
      },
      {
        x: 30,
        y: 0.00785,
        cumulative: 0.209,
      },
      {
        x: 40,
        y: 0.009435,
        cumulative: 0.2946,
      },
    ],
  })
  normalDistribution: {
    minutes: number;
    probability: number;
    cumulative: number;
  }[];

  @ApiProperty({
    description:
      'Forecast of notebook withdrawals for the next 7 weekdays (Monday to Saturday), based on linear regression applied to the average number of past withdrawals per day of the week. Returns the predicted date and estimated number of withdrawals.',
    example: [
      {
        next_date: '2025-06-02',
        estimated_quantity: 3,
      },
      {
        next_date: '2025-06-03',
        estimated_quantity: 3,
      },
      {
        next_date: '2025-06-04',
        estimated_quantity: 2,
      },
    ],
  })
  withdrawalForecast: {
    next_date: string;
    estimated_quantity: number;
  }[];

  @ApiProperty({
    description: 'Total number of withdrawals per day in the last 7 days',
    example: [
      {
        day: 'Domingo',
        total_withdrawals: 0,
      },
      {
        day: 'Segunda',
        total_withdrawals: 45,
      },
      {
        day: 'Terça',
        total_withdrawals: 28,
      },
    ],
  })
  dailyWithdrawalsLastWeek: {
    day: string;
    total_withdrawals: number;
  }[];

  @ApiProperty({
    description: 'List of notebooks that were withdrawn but not yet returned',
    example: [
      {
        device_name: 'Dell XPS 13',
        discipline: 'IoT',
        checkout_datetime: '2025-05-03 12:30:27',
      },
      {
        device_name: 'Dell XPS 13',
        discipline: 'IoT',
        checkout_datetime: '2025-05-03 10:25:27',
      },
    ],
  })
  unreturnedNotebooks: {
    device_name: string;
    discipline: string;
    checkout_datetime: string;
  }[];

  @ApiProperty({
    description:
      'Skewness of the usage time distribution and its interpretation',
    example: {
      skewness: 0.992,
      interpretation:
        'Distribuição assimétrica à direita: alguns usuários usam os notebooks por muito mais tempo que a média.',
    },
  })
  usageTimeSkewness: {
    skewness: number;
    interpretation: string;
  };
}
