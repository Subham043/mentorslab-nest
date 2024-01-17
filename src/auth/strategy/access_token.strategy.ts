import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../dto/jwt_payload.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) =>
          request.cookies[process.env.APP_NAME + '_access_token']
            ?.replace('Bearer', '')
            .trim() ||
          request.get('Authorization')?.replace('Bearer', '').trim(),
      ]),
      secretOrKey: process.env.JWT_SECRET_KEY || 'secretKey',
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const result = await this.userModel.findOne({
      where: {
        id: payload.id,
      },
    });
    if (!result) throw new ForbiddenException('Access token malformed');
    return payload;
  }
}
