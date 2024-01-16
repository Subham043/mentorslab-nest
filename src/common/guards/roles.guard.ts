import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request?.get('Authorization')?.replace('Bearer', '').trim();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY || 'secretKey',
        ignoreExpiration: true,
      });

      const user = await this.userModel.findOne({
        where: { id: payload.id },
      });
      if (!user || user.role !== payload.role)
        throw new ForbiddenException(
          'You dont have the permission to access this',
        );

      return matchRoles(roles, user.role);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
function matchRoles(roles: string[], roles1: string): boolean {
  return true;
  return roles.includes(roles1);
}
