import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Subscription } from '../entities/subscription.entity';
import { RazorpayHook } from 'src/common/hooks/razorpay.hook';
import { Payment } from 'src/payment/entities/payment.entity';
import { FileHook } from 'src/common/hooks/file.hook';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription)
    private subscriptionModel: typeof Subscription,
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    private razorpayHook: RazorpayHook,
    private fileHook: FileHook,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const subscriptionByEmail = await this.findByEmail(
      createSubscriptionDto.email,
    );
    if (subscriptionByEmail) {
      return subscriptionByEmail;
    }
    const subscriptionByPhone = await this.findByPhone(
      createSubscriptionDto.phone,
    );
    if (subscriptionByPhone) {
      return subscriptionByPhone;
    }
    const savedFileName = await this.fileHook.saveFile(
      createSubscriptionDto.cv,
      'cv/',
    );
    const subscription = await this.subscriptionModel.create({
      ...createSubscriptionDto,
      cv: savedFileName,
    });
    const order = await this.razorpayHook.generateOrderId(
      500,
      subscription.id.toString(),
    );
    await this.paymentModel.create({
      amount: 500,
      order_id: order.id,
      subscription_id: subscription.id,
    });
    return await this.findOne(subscription.id);
  }

  async findAll(): Promise<Subscription[]> {
    return await this.subscriptionModel.findAll();
  }

  async findOne(id: number): Promise<Subscription> {
    return await this.subscriptionModel.findOne({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<Subscription> {
    return await this.subscriptionModel.findOne({
      where: {
        email,
      },
    });
  }

  async findByPhone(phone: string): Promise<Subscription> {
    return await this.subscriptionModel.findOne({
      where: {
        phone,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.subscriptionModel.destroy({
      where: {
        id,
      },
    });
  }
}
