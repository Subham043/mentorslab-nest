import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EmailSubscriptionnDto } from '../dto/email-subscription.dto';

export class SubscriptionMailProducer {
  constructor(
    @InjectQueue('subscription-mail-queue') private readonly mailQueue: Queue,
  ) {}

  async sendSubscription(payload: EmailSubscriptionnDto) {
    await this.mailQueue.add('subscription-mail-job', {
      ...payload,
    });
  }
}
