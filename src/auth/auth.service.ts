import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from './dto/token.dto';
import { JwtPayload } from './dto/jwt_payload.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async generateTokens(user: any): Promise<Token> {
    const jwtPayload: JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET_KEY || 'secretKey',
        expiresIn: process.env.JWT_EXPIRY_TIME || '60s',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_REFRESH_SECRET_KEY || 'secretKey',
        expiresIn: process.env.JWT_REFRESH_EXPIRY_TIME || '1d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async login(dto: LoginDto): Promise<Token> {
    const user = await this.userModel.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new BadRequestException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) throw new BadRequestException('Invalid credentials');
    const token = await this.generateTokens(user);
    await this.storeRefreshToken(user.id, token.refresh_token);
    return token;
  }

  async register(dto: RegisterDto): Promise<User> {
    try {
      const { password } = dto;
      const hash = await bcrypt.hash(
        password,
        Number(process.env.saltOrRounds),
      );
      dto.password = hash;

      const user = await this.userModel.scope('withoutPassword').create({
        ...dto,
        otp: this.generateOtpNumber(),
      });
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async storeRefreshToken(id: number, refresh_token: string): Promise<void> {
    const hash = await bcrypt.hash(
      refresh_token,
      Number(process.env.saltOrRounds),
    );
    await this.userModel.update(
      {
        isVerified: true,
        hashed_refresh_token: hash,
      },
      {
        where: {
          id,
        },
      },
    );
  }

  generateOtpNumber(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }
}
