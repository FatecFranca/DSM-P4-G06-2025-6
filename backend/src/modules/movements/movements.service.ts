import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { format } from 'date-fns';

@Injectable()
export class MovementsService {
  constructor(private readonly prisma: PrismaService) {}

  async handleNfcMovement(nfc_tag: string, datetime: string) {
    const notebook = await this.prisma.notebooks.findFirst({
      where: { nfc_tag },
    });
    if (!notebook) throw new NotFoundException('notebook not found.');
    const notebook_id = notebook.id;

    const cabinet = await this.prisma.cabinets.findFirst({
      where: { notebooks: { some: { id: notebook_id } } },
    });
    if (!cabinet) throw new NotFoundException('cabinet not found.');
    const room_id = cabinet.room_id;

    const weekdays = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ];

    const captureDate = new Date(datetime);
    const dayOfWeekIndex = captureDate.getDay();
    const formattedDay = weekdays[dayOfWeekIndex];

    const timeOnly = format(captureDate, 'HH:mm:ss');

    const scheduleResult = await this.prisma.$queryRaw<
      Array<{ id: number }>
    >`SELECT id FROM schedules
    WHERE room_id = ${room_id}
      AND day_of_week = ${formattedDay}
      AND start_time <= ${timeOnly}
      AND end_time >= ${timeOnly}
    LIMIT 1`;

    if (!scheduleResult.length) {
      throw new NotFoundException(
        'no classes scheduled for this room at this time.',
      );
    }
    const schedule_id = scheduleResult[0].id;

    const existingMovement = await this.prisma.movements.findFirst({
      where: {
        notebook_id,
        schedule_id,
        room_id,
        return_datetime: null,
        checkout_datetime: {
          gte: new Date('2000-01-01T00:00:00.000Z'),
        },
      },
    });

    if (!existingMovement) {
      await this.prisma.$executeRaw`
        INSERT INTO movements (notebook_id, checkout_datetime, schedule_id, room_id)
        VALUES (${notebook_id}, ${datetime}, ${schedule_id}, ${room_id})
      `;
    } else {
      await this.prisma.$executeRaw`
        UPDATE movements
        SET return_datetime = ${datetime}
        WHERE id = ${existingMovement.id}
      `;
    }
  }
}
