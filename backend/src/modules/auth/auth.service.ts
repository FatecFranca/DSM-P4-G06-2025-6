import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterAuthBodyDTO } from './dto/register-auth-body.dto';
import { users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginAuthBodyDTO } from './dto/login-auth-body.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterAuthBodyDTO): Promise<Omit<users, 'password'>> {
    const foundUser = await this.findUserByEmail(data.email);

    if (foundUser) {
      throw new ConflictException('this user email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const createdAt = await this.prisma.$queryRaw`SELECT NOW() as now`;

    const user = await this.prisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        createdAt: createdAt[0].now,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(data: LoginAuthBodyDTO) {
    const user = await this.findUserByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('incorrect email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('incorrect email or password');
    }

    return this.generateToken(user);
  }

  async findUserByEmail(email: string): Promise<users | null> {
    const user = await this.prisma.users.findUnique({ where: { email } });

    return user;
  }

  async findUserById(id: number): Promise<users | null> {
    const user = await this.prisma.users.findUnique({ where: { id } });

    return user;
  }

  private generateToken(user: users): { accessToken: string } {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }
}
