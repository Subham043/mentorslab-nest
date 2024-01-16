import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { MainExceptionsFilter } from './common/filters/exception.interceptor';
import { JOIPIPE_OPTIONS, JoiPipe, JoiPipeModule } from 'nestjs-joi';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      models: [User],
      autoLoadModels: true,
      synchronize: true,
      sync: { force: true },
    }),
    UserModule,
    AuthModule,
    JoiPipeModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: MainExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useClass: JoiPipe,
    },
    {
      provide: JOIPIPE_OPTIONS,
      useValue: {
        usePipeValidationException: true,
      },
    },
  ],
})
export class AppModule {}
