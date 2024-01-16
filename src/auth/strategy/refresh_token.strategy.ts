import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtRefreshPayload } from '../dto/jwt_refresh_payload.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const refreshToken =
            request?.cookies['auth._refresh_token.local']
              ?.replace('Bearer', '')
              .trim() ||
            request?.get('Authorization')?.replace('Bearer', '').trim();
          return refreshToken;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET_KEY || 'secretKey',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any): JwtRefreshPayload {
    const refreshToken =
      req?.cookies['auth._refresh_token.local']?.replace('Bearer', '').trim() ||
      req?.get('Authorization')?.replace('Bearer', '').trim();

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
    const result = this.userModel.findOne({
      where: {
        id: payload.id,
      },
    });
    if (!result) throw new ForbiddenException('Refresh token malformed');
    return {
      ...payload,
      refreshToken,
    };
  }
}
