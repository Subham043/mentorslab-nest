import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtRefreshPayload } from '../dto/jwt_refresh_payload.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';
import { JwtPayload } from '../dto/jwt_payload.dto';
import * as bcrypt from 'bcrypt';

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
          return (
            request?.cookies[process.env.APP_NAME + '_refresh_token']
              ?.replace('Bearer', '')
              .trim() ||
            request?.get('Authorization')?.replace('Bearer', '').trim()
          );
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET_KEY || 'secretKey',
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(
    req: Request,
    payload: JwtPayload,
  ): Promise<JwtRefreshPayload> {
    const refreshToken =
      req.cookies[process.env.APP_NAME + '_refresh_token']
        ?.replace('Bearer', '')
        .trim() || req?.get('Authorization')?.replace('Bearer', '').trim();

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

    const result = await this.userModel.findOne({
      where: {
        id: payload.id,
      },
      attributes: ['id', 'hashed_refresh_token'],
    });

    if (!result) throw new ForbiddenException('Refresh token malformed');

    if (!result.hashed_refresh_token)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      result.hashed_refresh_token,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    return {
      ...payload,
      refreshToken,
    };
  }
}
