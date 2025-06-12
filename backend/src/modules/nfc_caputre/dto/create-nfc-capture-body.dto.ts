import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateNfcCaptureBody {
  @ApiProperty({
    type: 'string',
    description: 'Id that represents that nfc tag read by the sensor',
    example: 'NFC001',
  })
  @IsNotEmpty()
  @IsString()
  nfc_tag: string;

  @ApiProperty({
    type: 'string',
    description:
      'Datetime in string that represents the time the nfc tag was read by the sensor',
    example: '2025-05-31 11:25:27',
  })
  @IsNotEmpty()
  @IsDateString()
  datetime: string;
}
