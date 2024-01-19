import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SubscriptionCreatedEvent } from '../dto/subscription-created.dto';
import { MailService } from 'src/mail/mail.service';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SubscriptionEventListener {
  constructor(
    private readonly mailService: MailService,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  @OnEvent('subscription.created')
  async handleSubscriptionCreatedEvent(payload: SubscriptionCreatedEvent) {
    const user = await this.userModel.findOne({
      where: {
        email: payload.data.email,
      },
    });
    if (!user) {
      await this.userModel.create({
        firstName: payload.data.firstName,
        lastName: payload.data.lastName,
        email: payload.data.email,
        phone: payload.data.phone,
        password:
          payload.data.firstName.trim() +
          '_' +
          payload.data.lastName.trim() +
          '@2024',
      });
      this.mailService.sendSubscription({
        ...payload.data.dataValues,
        type: 'new',
        password:
          payload.data.firstName.trim() +
          '_' +
          payload.data.lastName.trim() +
          '@2024',
      });
    }
    this.mailService.sendSubscription({
      ...payload.data.dataValues,
      type: 'old',
    });
  }
}
