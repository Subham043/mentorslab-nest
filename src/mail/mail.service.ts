import { Injectable } from '@nestjs/common';
import { EmailVerificationDto } from './dto/email-verification.dto';
import { MailProducer } from './producer/mail.producer';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { SubscriptionMailProducer } from './producer/subscription_mail.producer';

@Injectable()
export class MailService {
  constructor(
    private readonly mailProducer: MailProducer,
    private readonly subscriptionMailProducer: SubscriptionMailProducer,
  ) {}

  async sendEmailVerification(payload: EmailVerificationDto) {
    await this.mailProducer.sendEmailVerification(payload);
  }

  async sendSubscription(
    payload: Subscription &
      ({ type: 'old' } | { type: 'new'; password: string }),
  ) {
    await this.subscriptionMailProducer.sendSubscription({ data: payload });
  }
}
