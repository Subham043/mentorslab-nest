import { Module } from '@nestjs/common';
import { SubscriptionService } from './service/subscription.service';
import { SubscriptionController } from './controller/subscription.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subscription } from './entities/subscription.entity';
import { RazorpayHook } from 'src/common/hooks/razorpay.hook';
import { Payment } from 'src/payment/entities/payment.entity';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FileHook } from 'src/common/hooks/file.hook';
import { SubscriptionEventListener } from './event/subscription.event';
import { IsSubscriptionEmailUniqueRule } from 'src/common/validator/is_subscription_email_unique.validator';
import { IsSubscriptionPhoneUniqueRule } from 'src/common/validator/is_subscription_phone_unique.validator';
import { MailModule } from 'src/mail/mail.module';
import { User } from 'src/user/entities/user.entity';

@Module({
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    RazorpayHook,
    FileHook,
    SubscriptionEventListener,
    IsSubscriptionEmailUniqueRule,
    IsSubscriptionPhoneUniqueRule,
  ],
  imports: [
    SequelizeModule.forFeature([Subscription, Payment, User]),
    NestjsFormDataModule,
    MailModule,
  ],
})
export class SubscriptionModule {}
