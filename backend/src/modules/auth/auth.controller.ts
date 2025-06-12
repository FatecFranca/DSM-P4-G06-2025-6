import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterAuthBodyDTO } from './dto/register-auth-body.dto';
import { AuthService } from './auth.service';
import { LoginAuthBodyDTO } from './dto/login-auth-body.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: "Register a manager's account in the system",
    description: 'Requires a valid email address and a secure password.',
  })
  @ApiResponse({
    status: 201,
    description: 'Manager registered successfully',
    example: {
      id: 1,
      name: 'Erick Santos',
      email: 'ericksantos019@edu.sp.gov.com',
      createdAt: '2025-05-31T11:20:53.000Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid values',
    content: {
      'application/json': {
        examples: {
          nameBadRequest: {
            summary: 'Empty name value or invalid format',
            value: {
              message: ['name must be a string', 'name should not be empty'],
              error: 'Bad Request',
              statusCode: 400,
            },
          },
          emailBadRequest: {
            summary: 'Empty email or invalid format',
            value: {
              message: ['email must be an email', 'email should not be empty'],
              error: 'Bad Request',
              statusCode: 400,
            },
          },
          passwordBadRequest: {
            summary: 'Empty password or invalid format',
            value: {
              message: [
                'password must be a string',
                'password should not be empty',
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
    status: 409,
    description: 'Conflict - This user email already exists.',
    content: {
      'application/json': {
        examples: {
          emailConflict: {
            summary: 'This manager email has already been registered',
            value: {
              message: 'this user email already exists',
              error: 'Conflict',
              statusCode: 409,
            },
          },
        },
      },
    },
  })
  @Post('register')
  async register(@Body() data: RegisterAuthBodyDTO) {
    return this.authService.register(data);
  }

  @ApiOperation({
    summary: 'Log in to the manager account in the system',
    description:
      'Requires a valid email address and password that have already been registered to log in.',
  })
  @ApiResponse({
    status: 200,
    description: 'Manager successfully logged in.',
    schema: {
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid values',
    content: {
      'application/json': {
        examples: {
          emailBadRequest: {
            summary: 'Empty email or invalid format',
            value: {
              message: ['email must be an email', 'email should not be empty'],
              error: 'Bad Request',
              statusCode: 400,
            },
          },
          passwordBadRequest: {
            summary: 'Empty password or invalid format',
            value: {
              message: [
                'password must be a string',
                'password should not be empty',
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
    status: 401,
    description: 'Unauthorized - Incorrect email or password',
    content: {
      'application/json': {
        examples: {
          loginUnauthorized: {
            summary: 'Incorrect email or password field values',
            value: {
              message: 'incorrect email or password',
              error: 'Unauthorized',
              statusCode: 401,
            },
          },
        },
      },
    },
  })
  @HttpCode(200)
  @Post('login')
  async login(@Body() data: LoginAuthBodyDTO) {
    return this.authService.login(data);
  }
}
