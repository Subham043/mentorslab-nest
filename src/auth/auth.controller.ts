import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async signIn(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return result;
  }

  @Post('sign-up')
  @Public()
  async signUp(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return result;
  }
}
