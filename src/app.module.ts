import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MainExceptionsFilter } from './common/filters/exception.interceptor';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import configuration from './common/config/configuration';
import { RolesGuard } from './common/guards/roles.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottleGuard } from './common/guards/throttle.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 200,
      },
    ]),
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
      logging: false,
      sync: { force: true },
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: MainExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottleGuard,
    },
  ],
  exports: [ThrottlerModule],
})
export class AppModule {}
