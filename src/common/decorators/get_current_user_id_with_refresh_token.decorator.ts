import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtRefreshPayload } from 'src/auth/dto/jwt_refresh_payload.dto';

export const GetCurrentUserIdAndRefreshToken = createParamDecorator(
  (data: keyof JwtRefreshPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;

    return request.user[data];
  },
);
