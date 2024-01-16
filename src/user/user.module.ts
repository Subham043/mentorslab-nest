import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserModule],
  imports: [SequelizeModule.forFeature([User])],
})
export class UserModule {}
