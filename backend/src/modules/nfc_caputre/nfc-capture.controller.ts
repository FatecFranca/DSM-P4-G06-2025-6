import { Body, Controller, Post } from '@nestjs/common';
import { NfcCaptureService } from './nfc-capture.service';
import { CreateNfcCaptureBody } from './dto/create-nfc-capture-body.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('NFC-Capture')
@Controller('nfc-capture')
export class NfcCaptureController {
  constructor(private readonly nfcCaptureService: NfcCaptureService) {}

  @ApiOperation({
    summary: 'NFC tag reading record',
    description:
      'Requires an NFC TAG that is associated with a notebook and a valid datetime.',
  })
  @ApiResponse({
    status: 201,
    description: 'Created - NFC tag capture successful',
    example: {
      id: 1,
      nfc_tag: 'NFC001',
      datetime: '2025-05-31T11:25:27.000Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid values',
    content: {
      'application/json': {
        examples: {
          nfcTagBadRequest: {
            summary: 'Empty nfc tag value',
            value: {
              message: ['nfc_tag should not be empty'],
              error: 'Bad Request',
              statusCode: 400,
            },
          },
          datetimeBadRequest: {
            summary: 'Empty datetime or invalid format',
            value: {
              message: [
                'datetime must be a valid ISO 8601 date string',
                'datetime should not be empty',
              ],
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    content: {
      'application/json': {
        examples: {
          notebookNotFound: {
            summary: 'Notebook not found with the given NFC tag.',
            value: {
              message: 'notebook not found.',
              error: 'Not Found',
              statusCode: 404,
            },
          },
          cabinetIdNotFound: {
            summary: 'No cabinet found for the notebook.',
            value: {
              message: 'cabinet not found.',
              error: 'Not Found',
              statusCode: 404,
            },
          },
          scheduleIdNotFound: {
            summary: 'No scheduled class found for the room at this time.',
            value: {
              message: 'no classes scheduled for this room at this time.',
              error: 'Not Found',
              statusCode: 404,
            },
          },
        },
      },
    },
  })
  @Post()
  async createCapture(@Body() data: CreateNfcCaptureBody) {
    return this.nfcCaptureService.create(data);
  }
}
