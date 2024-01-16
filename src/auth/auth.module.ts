import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'src/common/config/configuration';
import { IsPhoneUniqueRule } from 'src/common/validator/is_phone_unique.validator';
import { IsSameRule } from 'src/common/validator/is_same.validator';
import { IsEmailUniqueRule } from 'src/common/validator/is_email_unique.validator';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config.config.jwt.secret_key,
      signOptions: { expiresIn: config.config.jwt.expiry_time },
    }),
    SequelizeModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, IsEmailUniqueRule, IsSameRule, IsPhoneUniqueRule],
  exports: [JwtModule],
})
export class AuthModule {}
