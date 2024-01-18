import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { IsEmailUniqueRule } from 'src/common/validator/is_email_unique.validator';
import { IsSameRule } from 'src/common/validator/is_same.validator';
import { IsPhoneUniqueRule } from 'src/common/validator/is_phone_unique.validator';

@Module({
  controllers: [UserController],
  providers: [UserService, IsEmailUniqueRule, IsSameRule, IsPhoneUniqueRule],
  exports: [UserModule, SequelizeModule],
  imports: [SequelizeModule.forFeature([User])],
})
export class UserModule {}
