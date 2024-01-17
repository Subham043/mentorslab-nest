import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  NotFoundException,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ConfigVariablesType } from 'src/common/config/configuration';
import { AccessTokenGuard } from 'src/common/guards/access_token.guard';
import { GetCurrentUserId } from 'src/common/decorators/get_current_user_id.decorator';
import { RefreshTokenGuard } from 'src/common/guards/refresh_token.guard';
import { GetCurrentUserIdAndRefreshToken } from 'src/common/decorators/get_current_user_id_with_refresh_token.decorator';
import { JwtRefreshPayload } from './dto/jwt_refresh_payload.dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService<ConfigVariablesType>,
  ) {}

  @Post('sign-in')
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async signIn(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);
    response.cookie(
      this.configService.get('app.name', {
        infer: true,
      }) + '_access_token',
      'Bearer ' + result.access_token,
    );
    response.cookie(
      this.configService.get('app.name', {
        infer: true,
      }) + '_refresh_token',
      'Bearer ' + result.refresh_token,
    );
    return result;
  }

  @Post('sign-up')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async signUp(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return result;
  }

  @Get('profile')
  @UseGuards(AccessTokenGuard)
  @SetMetadata('roles', ['ADMIN', 'USER'])
  async getProfile(@GetCurrentUserId() id: number) {
    const result = await this.authService.profile(id);
    if (!result) throw new NotFoundException('Profile Not Found');
    return result;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async refreshToken(
    @GetCurrentUserIdAndRefreshToken() data: JwtRefreshPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.refreshTokens(
      data.id,
      data.refreshToken,
    );
    response.cookie(
      this.configService.get('app.name', {
        infer: true,
      }) + '_access_token',
      'Bearer ' + result.access_token,
    );
    response.cookie(
      this.configService.get('app.name', {
        infer: true,
      }) + '_refresh_token',
      'Bearer ' + result.refresh_token,
    );
    return result;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('logout')
  async logout(
    @GetCurrentUserIdAndRefreshToken() data: JwtRefreshPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.logout(data.id);
    response.cookie(
      this.configService.get('app.name', {
        infer: true,
      }) + '_access_token',
      '',
    );
    response.cookie(
      this.configService.get('app.name', {
        infer: true,
      }) + '_refresh_token',
      '',
    );
    return result;
  }
}
