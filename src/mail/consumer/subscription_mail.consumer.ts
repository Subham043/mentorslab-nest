import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ConfigVariablesType } from 'src/common/config/configuration';
import { EmailSubscriptionnDto } from '../dto/email-subscription.dto';

@Processor('subscription-mail-queue')
export class SubscriptionMailConsumer {
  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService<ConfigVariablesType>,
  ) {}

  @Process('subscription-mail-job')
  async subscriptionMailJob(job: Job<EmailSubscriptionnDto>) {
    await this.mailerService.sendMail({
      to: job.data.data.email,
      subject:
        'Welcome to ' +
        this.configService.get('app.name', { infer: true }) +
        '! Thank you for subscribing.',
      template: './email_verification',
      context: {
        name: job.data.data.name,
        url: '',
      },
    });
  }
}
