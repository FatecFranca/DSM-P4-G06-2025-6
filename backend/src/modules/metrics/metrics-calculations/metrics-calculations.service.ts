import { Injectable } from '@nestjs/common';
import { differenceInMilliseconds, differenceInMinutes } from 'date-fns';
import {
  cumulativeStdNormalProbability,
  linearRegression,
  linearRegressionLine,
  mean,
  median,
  sampleSkewness,
  standardDeviation,
} from 'simple-statistics';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class MetricsCalculationService {
  constructor(private readonly prisma: PrismaService) {}

  async getWithdrawalsByCourse() {
    const groupedMovements = await this.prisma.movements.groupBy({
      by: ['schedule_id'],
      _count: {
        _all: true,
      },
    });

    const allSchedules = await this.prisma.schedules.findMany({
      include: {
        courses: {
          select: {
            id: true,
            short_name: true,
          },
        },
      },
    });

    const withdrawalsByCourse: Record<string, number> = {};

    for (const movement of groupedMovements) {
      const relatedSchedule = allSchedules.find(
        (schedule) => schedule.id === movement.schedule_id,
      );

      if (!relatedSchedule || !relatedSchedule.course_id) continue;

      const courseShortName = relatedSchedule.courses.short_name;
      withdrawalsByCourse[courseShortName] =
        (withdrawalsByCourse[courseShortName] || 0) + movement._count._all;
    }

    const result = Object.entries(withdrawalsByCourse).map(
      ([course, total]) => ({
        course,
        total,
      }),
    );

    return result;
  }

  async getMostFrequentDiscipline() {
    const groupedMovements = await this.prisma.movements.groupBy({
      by: ['schedule_id'],
      _count: {
        schedule_id: true,
      },
      orderBy: {
        _count: {
          schedule_id: 'desc',
        },
      },
      take: 1,
    });

    if (!groupedMovements.length) return null;

    const disciplineData = await this.prisma.schedules.findUnique({
      where: { id: groupedMovements[0].schedule_id },
      select: { discipline: true, day_of_week: true },
    });

    if (!disciplineData) return null;

    return {
      disciplineName: disciplineData.discipline,
      dayOfDiscipline: disciplineData.day_of_week,
      total: groupedMovements[0]._count.schedule_id,
    };
  }

  async getAverageUsageTime(): Promise<number> {
    const movements = await this.prisma.movements.findMany({
      where: {
        return_datetime: { not: null },
      },
      select: {
        checkout_datetime: true,
        return_datetime: true,
      },
    });

    const usageTimes = movements.map(
      (movement) =>
        differenceInMilliseconds(
          new Date(movement.return_datetime),
          new Date(movement.checkout_datetime),
        ) /
        1000 /
        60,
    );

    return usageTimes.length > 0 ? mean(usageTimes) : 0;
  }

  async getMedianUsageTime(): Promise<number> {
    const movements = await this.prisma.movements.findMany({
      where: {
        return_datetime: {
          not: null,
        },
      },
      select: {
        checkout_datetime: true,
        return_datetime: true,
      },
    });

    const durations = movements.map((movement) =>
      differenceInMinutes(
        new Date(movement.return_datetime),
        new Date(movement.checkout_datetime),
      ),
    );

    if (durations.length === 0) return 0;

    return median(durations);
  }

  async getWithdrawalsByPeriod() {
    const groupedWithdrawals = await this.prisma.movements.groupBy({
      by: ['schedule_id'],
      _count: {
        _all: true,
      },
    });

    const schedules = await this.prisma.schedules.findMany({
      include: {
        courses: {
          select: {
            id: true,
            period: true,
          },
        },
      },
    });

    const countByPeriod: Record<string, number> = {};

    for (const item of groupedWithdrawals) {
      const schedule = schedules.find((s) => s.id === item.schedule_id);
      if (!schedule || !schedule.course_id) continue;

      const period = schedule.courses.period;
      countByPeriod[period] = (countByPeriod[period] || 0) + item._count._all;
    }

    const result = Object.entries(countByPeriod).map(([period, quantity]) => ({
      period,
      quantity,
    }));

    return result;
  }

  async getTop5LongestAverageUsage() {
    const averageTimes = await this.prisma.$queryRaw<
      { notebook_id: number; media_minutos: number }[]
    >`
    SELECT
      notebook_id,
      AVG(TIMESTAMPDIFF(SECOND, checkout_datetime, return_datetime) / 60) AS media_minutos
    FROM movements
    WHERE return_datetime IS NOT NULL
    GROUP BY notebook_id
    ORDER BY media_minutos DESC
    LIMIT 5
  `;

    const notebookIds = averageTimes.map((item) => item.notebook_id);

    const notebooks = await this.prisma.notebooks.findMany({
      where: {
        id: {
          in: notebookIds,
        },
      },
      select: {
        id: true,
        device_name: true,
      },
    });

    const result = averageTimes.map((item) => {
      const notebook = notebooks.find((n) => n.id === item.notebook_id);
      return {
        notebookName: notebook?.device_name || 'Desconhecido',
        averageUsageTimeMinutes: Number(item.media_minutos.toFixed(2)),
      };
    });

    return result;
  }

  async getUsageTimeStandardDeviation(): Promise<{
    standardDeviation: number;
  }> {
    const movements = await this.prisma.movements.findMany({
      where: {
        return_datetime: {
          not: null,
        },
      },
      select: {
        checkout_datetime: true,
        return_datetime: true,
      },
    });

    const durations = movements.map((movement) =>
      differenceInMinutes(
        new Date(movement.return_datetime!),
        new Date(movement.checkout_datetime),
      ),
    );

    if (durations.length === 0) {
      return { standardDeviation: 0 };
    }

    const std = standardDeviation(durations);

    return {
      standardDeviation: Number(std.toFixed(1)),
    };
  }

  async getNormalDistribution() {
    const movements = await this.prisma.movements.findMany({
      where: {
        return_datetime: {
          not: null,
        },
      },
      select: {
        checkout_datetime: true,
        return_datetime: true,
      },
    });

    const usageTimes = movements.map((movement) => {
      const start = new Date(movement.checkout_datetime).getTime();
      const end = new Date(movement.return_datetime).getTime();
      return (end - start) / 60000;
    });

    if (usageTimes.length === 0) return [];

    const _mean = mean(usageTimes);
    const _std = standardDeviation(usageTimes); // sample std dev

    const interval = 10;
    const maxX = Math.ceil(_mean + 4 * _std);
    const distribution = [];

    for (let x = 0; x <= maxX; x += interval) {
      // PDF
      const exponent = -Math.pow(x - _mean, 2) / (2 * Math.pow(_std, 2));
      const y = (1 / (_std * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);

      // CDF
      const z = (x - _mean) / _std;
      const cdf = cumulativeStdNormalProbability(z); // prob até x

      distribution.push({
        x,
        y: parseFloat(y.toFixed(6)), // PDF
        cumulative: parseFloat(cdf.toFixed(6)), // CDF
      });
    }

    return distribution;
  }

  async getWithdrawalForecast() {
    const totals = await this.prisma.$queryRawUnsafe<
      { day_of_week: number; total: bigint; distinct_days: bigint }[]
    >(`
      SELECT
        DAYOFWEEK(checkout_datetime) - 1 AS day_of_week,
        COUNT(*) AS total,
        COUNT(DISTINCT DATE(checkout_datetime)) AS distinct_days
      FROM movements
      WHERE return_datetime IS NOT NULL
        AND DAYOFWEEK(checkout_datetime) BETWEEN 2 AND 7 -- Monday (2) to Saturday (7)
      GROUP BY day_of_week
      ORDER BY day_of_week
    `);

    const averages = totals.map(({ day_of_week, total, distinct_days }) => ({
      x: Number(day_of_week),
      y: distinct_days > 0 ? Number(total) / Number(distinct_days) : 0,
    }));

    if (averages.length < 2) {
      return [];
    }

    const regressionModel = linearRegression(
      averages.map(({ x, y }) => [x, y]),
    );
    const predict = linearRegressionLine(regressionModel);

    const nowUtc = new Date();
    const todayBr = this.getBrasiliaDate(nowUtc); // sempre 00:00 do dia atual em BRT
    
    let date = new Date(todayBr);
    date.setDate(date.getDate() + 1);
    
    const forecast = [];
    
    while (forecast.length < 7) {
      const brDate = this.getBrasiliaDate(date);
      const dayOfWeek = brDate.getDay();
    
      if (dayOfWeek >= 1 && dayOfWeek <= 6) {
        const x = dayOfWeek;
        const y = predict(x);
    
        forecast.push({
          next_date: brDate.toLocaleDateString('en-CA'),
          estimated_quantity: Math.max(0, Math.round(y)),
        });
      }
    
      date.setDate(date.getDate() + 1);
    }

    return forecast;
  }

  async getDailyWithdrawalsLastWeek() {
    const results = await this.prisma.$queryRaw<
      { day_of_week: string; total: bigint }[]
    >`
    SELECT 
      CASE DAYOFWEEK(checkout_datetime)
        WHEN 2 THEN 'Segunda'
        WHEN 3 THEN 'Terça'
        WHEN 4 THEN 'Quarta'
        WHEN 5 THEN 'Quinta'
        WHEN 6 THEN 'Sexta'
        WHEN 7 THEN 'Sábado'
        WHEN 1 THEN 'Domingo'
      END AS day_of_week,
      COUNT(*) AS total
    FROM movements
    WHERE 
      WEEKOFYEAR(checkout_datetime) = WEEKOFYEAR(CURDATE()) - 1
    GROUP BY day_of_week
    ORDER BY FIELD(
      day_of_week, 
      'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
    )
  `;

    const daysOfWeek = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ];

    const resultsWithZero = daysOfWeek.map((day) => ({
      day,
      total_withdrawals: 0,
    }));

    results.forEach((item) => {
      const dayOfWeek = item.day_of_week;
      const total = Number(item.total);

      const day = resultsWithZero.find((d) => d.day === dayOfWeek);
      if (day) {
        day.total_withdrawals = total;
      }
    });

    return resultsWithZero;
  }

  async getUnreturnedNotebooks() {
    const results = await this.prisma.$queryRawUnsafe<
      {
        device_name: string;
        discipline: string;
        checkout_datetime: string;
      }[]
    >(`
    SELECT 
      n.device_name,
      s.discipline,
      DATE_FORMAT(m.checkout_datetime, '%Y-%m-%d %H:%i:%s') AS checkout_datetime
    FROM movements m
    JOIN notebooks n ON m.notebook_id = n.id
    JOIN schedules s ON m.schedule_id = s.id
    WHERE m.return_datetime IS NULL
    ORDER BY m.checkout_datetime DESC
  `);

    return results.map((item) => ({
      device_name: item.device_name,
      discipline: item.discipline,
      checkout_datetime: item.checkout_datetime,
    }));
  }

  async getUsageTimeSkewness() {
    const movements = await this.prisma.movements.findMany({
      where: {
        return_datetime: {
          not: null,
        },
      },
      select: {
        checkout_datetime: true,
        return_datetime: true,
      },
    });

    const usageTimes = movements.map((movement) => {
      const start = new Date(movement.checkout_datetime).getTime();
      const end = new Date(movement.return_datetime).getTime();
      return (end - start) / 60000;
    });

    if (usageTimes.length < 3) {
      return {
        skewness: null,
        interpretation: 'Dados insuficientes para calcular a assimetria.',
      };
    }

    const skew = sampleSkewness(usageTimes);

    let interpretation =
      'Distribuição simétrica. A média representa bem os dados.';
    if (skew > 0.5) {
      interpretation =
        'Distribuição assimétrica à direita: alguns usuários usam os notebooks por muito mais tempo que a média.';
    } else if (skew < -0.5) {
      interpretation =
        'Distribuição assimétrica à esquerda: alguns usuários usam os notebooks por muito menos tempo que a média.';
    }

    return {
      skewness: parseFloat(skew.toFixed(3)),
      interpretation,
    };
  }

  getBrasiliaDate(date: Date): Date {
    const utc = date.getTime();
    const offset = -3 * 60 * 60 * 1000; // UTC-3 em ms
    const brtDate = new Date(utc + offset);
  
    // Zera as horas para evitar erros com mudança de horário
    return new Date(
      brtDate.getFullYear(),
      brtDate.getMonth(),
      brtDate.getDate()
    );
  }
}
