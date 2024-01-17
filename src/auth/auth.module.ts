import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { IsPhoneUniqueRule } from 'src/common/validator/is_phone_unique.validator';
import { IsSameRule } from 'src/common/validator/is_same.validator';
import { IsEmailUniqueRule } from 'src/common/validator/is_email_unique.validator';
import { ConfigService } from '@nestjs/config';
import { ConfigVariablesType } from 'src/common/config/configuration';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService<ConfigVariablesType>) => ({
        secret: configService.get('jwt.secret_key', { infer: true }),
        signOptions: {
          expiresIn: configService.get('jwt.expiry_time', {
            infer: true,
          }),
        },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, IsEmailUniqueRule, IsSameRule, IsPhoneUniqueRule],
  exports: [JwtModule],
})
export class AuthModule {}
