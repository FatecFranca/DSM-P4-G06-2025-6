import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { NfcCaptureModule } from './modules/nfc_caputre/nfc-capture.module';
import { MovementsModule } from './modules/movements/movements.module';
import { MetricsModule } from './modules/metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    NfcCaptureModule,
    MovementsModule,
    MetricsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
