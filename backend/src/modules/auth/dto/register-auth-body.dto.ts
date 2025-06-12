import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterAuthBodyDTO {
  @ApiProperty({
    type: 'string',
    description: "Manager's name",
    example: 'Erick Santos',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    description: "Manager's email",
    example: 'ericksantos019@edu.sp.gov.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    description: "Manager's password",
    example: '1234Aa',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
