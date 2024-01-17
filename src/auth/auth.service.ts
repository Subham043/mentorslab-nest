import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from './dto/token.dto';
import { JwtPayload } from './dto/jwt_payload.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { ConfigVariablesType } from 'src/common/config/configuration';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<ConfigVariablesType>,
    private readonly mailService: MailService,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async generateAccessToken(jwtPayload: JwtPayload): Promise<string> {
    return await this.jwtService.signAsync(jwtPayload);
  }

  async generateRefreshToken(jwtPayload: JwtPayload): Promise<string> {
    return await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get('jwt.refresh_secret_key', {
        infer: true,
      }),
      expiresIn: this.configService.get('jwt.refresh_expiry_time', {
        infer: true,
      }),
    });
  }

  async generateTokens(user: any): Promise<Token> {
    const jwtPayload: JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const [at, rt] = await Promise.all([
      this.generateAccessToken(jwtPayload),
      this.generateRefreshToken(jwtPayload),
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
      attributes: ['id', 'name', 'email', 'phone', 'role', 'password'],
    });

    if (!user) throw new BadRequestException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) throw new BadRequestException('Invalid credentials');
    const token = await this.generateTokens(user);
    await this.storeRefreshToken(user.id, token.refresh_token);
    return token;
  }

  async register(dto: RegisterDto): Promise<User> {
    const user = await this.userModel.create({
      ...dto,
    });
    await this.mailService.sendEmailVerification({
      name: user.name,
      email: user.email,
    });
    return user;
  }

  async profile(id: number): Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        id,
      },
    });
    return user;
  }

  async refreshTokens(userId: number, refresh_token: string): Promise<Token> {
    const user = await this.userModel.findOne({
      where: {
        id: Number(userId),
      },
    });
    if (!user) throw new ForbiddenException('Access Denied');

    const token = await this.generateRefreshToken({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    await this.storeRefreshToken(Number(userId), token);
    return {
      access_token: token,
      refresh_token,
    };
  }

  async logout(userId: number): Promise<string> {
    const user = await this.userModel.findOne({
      where: {
        id: Number(userId),
      },
    });
    if (!user) throw new ForbiddenException('Access Denied');

    await this.removeRefreshToken(Number(userId));
    return 'Logged Out Successfully';
  }

  async storeRefreshToken(id: number, refresh_token: string): Promise<void> {
    await this.userModel.update(
      {
        isVerified: true,
        hashed_refresh_token: await bcrypt.hash(
          refresh_token,
          +this.configService.get('hashing.salt_or_rounds', { infer: true }),
        ),
      },
      {
        where: {
          id,
        },
      },
    );
  }

  async removeRefreshToken(id: number): Promise<void> {
    await this.userModel.update(
      {
        verified: true,
        hashed_refresh_token: null,
      },
      {
        where: { id },
      },
    );
  }
}
