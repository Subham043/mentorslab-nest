import { Module } from '@nestjs/common';
import { SubscriptionService } from './service/subscription.service';
import { SubscriptionController } from './controller/subscription.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subscription } from './entities/subscription.entity';
import { RazorpayHook } from 'src/common/hooks/razorpay.hook';
import { Payment } from 'src/payment/entities/payment.entity';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, RazorpayHook],
  imports: [SequelizeModule.forFeature([Subscription, Payment])],
})
export class SubscriptionModule {}
