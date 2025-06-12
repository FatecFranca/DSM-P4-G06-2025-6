import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthBodyDTO {
  @ApiProperty({
    type: 'string',
    description: 'Manager login email',
    example: 'ericksantos019@edu.sp.gov.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'Manager login password',
    example: '1234Aa',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
