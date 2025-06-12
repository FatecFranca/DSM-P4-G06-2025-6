import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNfcCaptureBody } from './dto/create-nfc-capture-body.dto';
import { MovementsService } from '../movements/movements.service';

@Injectable()
export class NfcCaptureService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly movementService: MovementsService,
  ) {}

  async create(data: CreateNfcCaptureBody) {
    await this.prisma.$executeRaw`
      INSERT INTO nfc_capture (nfc_tag, datetime)
      VALUES (${data.nfc_tag}, ${data.datetime})
    `;

    await this.movementService.handleNfcMovement(data.nfc_tag, data.datetime);

    //optional
    const [capture] = await this.prisma.$queryRaw<
      { id: number; nfc_tag: string; datetime: Date }[]
    >`
      SELECT *
      FROM nfc_capture
      WHERE nfc_tag = ${data.nfc_tag}
      ORDER BY id DESC
      LIMIT 1
    `;

    return capture;
  }
}
