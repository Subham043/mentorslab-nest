import { EmailVerificationDto } from '../dto/email-verification.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export class MailProducer {
  constructor(@InjectQueue('mail-queue') private readonly mailQueue: Queue) {}
  async sendEmailVerification(payload: EmailVerificationDto) {
    await this.mailQueue.add('mail-job', {
      ...payload,
    });
  }
}
