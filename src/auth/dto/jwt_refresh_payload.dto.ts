import { JwtPayload } from './jwt_payload.dto';

export type JwtRefreshPayload = JwtPayload & { refreshToken: string };
