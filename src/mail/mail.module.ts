import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { BullModule } from '@nestjs/bull';
import { MailConsumer } from './consumer/mail.consumer';
import { MailProducer } from './producer/mail.producer';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubscriptionMailConsumer } from './consumer/subscription_mail.consumer';
import { SubscriptionMailProducer } from './producer/subscription_mail.producer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        name: 'digisole.in',
        host: 'digisole.in',
        port: 587,
        tls: {
          rejectUnauthorized: false,
        },
        secure: false,
        auth: {
          user: 'subham@digisole.in',
          pass: 'Subhamaks@88676',
        },
      },
      defaults: {
        from: '"No Reply" <subham@digisole.in>',
      },
      preview: false,
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
    BullModule.registerQueueAsync(
      {
        name: 'mail-queue',
      },
      {
        name: 'subscription-mail-queue',
      },
    ),
    SequelizeModule.forFeature([Subscription]),
  ],
  providers: [
    MailService,
    MailProducer,
    MailConsumer,
    SubscriptionMailConsumer,
    SubscriptionMailProducer,
  ],
  exports: [MailService],
})
export class MailModule {}
