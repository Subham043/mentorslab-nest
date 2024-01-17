import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';
import { ConfigVariablesType } from '../config/configuration';
import { JwtPayload } from 'src/auth/dto/jwt_payload.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService<ConfigVariablesType>,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const token =
      request.cookies[
        this.configService.get('app.name', {
          infer: true,
        }) + '_access_token'
      ]
        ?.replace('Bearer', '')
        .trim() || request.get('Authorization')?.replace('Bearer', '').trim();
    if (!token) throw new UnauthorizedException();

    const payload = await this.jwtService
      .verifyAsync<JwtPayload>(token, {
        secret: this.configService.get('jwt.secret_key', {
          infer: true,
        }),
        ignoreExpiration: false,
      })
      .catch(() => {
        throw new UnauthorizedException();
      });

    const user = await this.userModel.findOne({
      where: { id: payload.id },
    });

    if (!user) throw new UnauthorizedException();
    if (user.role !== payload.role) {
      throw new ForbiddenException(
        'You dont have the permission to access this',
      );
    }

    return matchRoles(roles, user.role);
  }
}
function matchRoles(roles: string[], roles1: string): boolean {
  return true;
  return roles.includes(roles1);
}
