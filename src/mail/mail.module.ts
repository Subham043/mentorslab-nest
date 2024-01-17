import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { BullModule } from '@nestjs/bull';
import { MailConsumer } from './mail.consumer';
import { MailProducer } from './mail.producer';
// import { MailProducer } from './mail.producer';

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
    BullModule.registerQueueAsync({
      name: 'mail-queue',
    }),
  ],
  providers: [MailService, MailProducer, MailConsumer],
  exports: [MailService],
})
export class MailModule {}
