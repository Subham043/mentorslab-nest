import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ConfigVariablesType } from 'src/common/config/configuration';
import { EmailVerificationDto } from './dto/email-verification.dto';

@Processor('mail-queue')
export class MailConsumer {
  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService<ConfigVariablesType>,
  ) {}

  @Process('mail-job')
  async mailJob(job: Job<EmailVerificationDto>) {
    await this.mailerService.sendMail({
      to: job.data.email,
      subject:
        'Welcome to ' +
        this.configService.get('app.name', { infer: true }) +
        '! Confirm your Email',
      template: './email_verification',
      context: {
        name: job.data.name,
        url: '',
      },
    });
  }
}
