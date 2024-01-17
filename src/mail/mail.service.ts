import { Injectable } from '@nestjs/common';
import { EmailVerificationDto } from './dto/email-verification.dto';
import { MailProducer } from './mail.producer';

@Injectable()
export class MailService {
  constructor(private readonly mailProducer: MailProducer) {}

  async sendEmailVerification(payload: EmailVerificationDto) {
    await this.mailProducer.sendEmailVerification(payload);
  }
}
