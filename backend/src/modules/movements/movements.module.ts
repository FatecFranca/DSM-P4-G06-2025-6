import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MovementsService],
  exports: [MovementsService],
})
export class MovementsModule {}
