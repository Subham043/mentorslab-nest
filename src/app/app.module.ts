import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MainExceptionsFilter } from '../common/filters/exception.interceptor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import configuration, {
  ConfigVariablesType,
} from '../common/config/configuration';
import { RolesGuard } from '../common/guards/roles.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottleGuard } from '../common/guards/throttle.guard';
import { AccessTokenStrategy } from '../auth/strategy/access_token.strategy';
import { RefreshTokenStrategy } from '../auth/strategy/refresh_token.strategy';
import { MailModule } from '../mail/mail.module';
import { BullModule } from '@nestjs/bull';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { Payment } from 'src/payment/entities/payment.entity';
import { PaymentModule } from 'src/payment/payment.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
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
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigVariablesType>) => ({
        dialect: 'mysql',
        host: configService.get('database.host', { infer: true }),
        port: configService.get('database.port', { infer: true }),
        username: configService.get('database.username', { infer: true }),
        password: configService.get('database.password', { infer: true }),
        database: configService.get('database.name', { infer: true }),
        models: [User, Subscription, Payment],
        autoLoadModels: true,
        synchronize: true,
        logging: false,
        sync: { force: true },
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigVariablesType>) => ({
        redis: {
          host: configService.get('redis.host', { infer: true }),
          port: configService.get('redis.port', { infer: true }),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    MailModule,
    SubscriptionModule,
    PaymentModule,
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
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [ThrottlerModule],
})
export class AppModule {}
