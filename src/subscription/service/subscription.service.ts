import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Subscription } from '../entities/subscription.entity';
import { RazorpayHook } from 'src/common/hooks/razorpay.hook';
import { Payment } from 'src/payment/entities/payment.entity';
import { FileHook } from 'src/common/hooks/file.hook';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SubscriptionCreatedEvent } from '../dto/subscription-created.dto';
import { VerifySubscriptionPaymentDto } from '../dto/verify-payment.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription)
    private subscriptionModel: typeof Subscription,
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    private razorpayHook: RazorpayHook,
    private fileHook: FileHook,
    private eventEmitter: EventEmitter2,
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
    const data = await this.findOne(subscription.id);
    this.eventEmitter.emit(
      'subscription.created',
      new SubscriptionCreatedEvent(data),
    );
    return data;
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

  async verify(verifySubscriptionPaymentDto: VerifySubscriptionPaymentDto) {
    const isVerified = this.razorpayHook.verifyPayment(
      verifySubscriptionPaymentDto.order_id,
      verifySubscriptionPaymentDto.payment_id,
      verifySubscriptionPaymentDto.payment_signature,
    );
    if (isVerified) {
      await this.subscriptionModel.update(
        {
          current_payment: {
            payment_id: verifySubscriptionPaymentDto.payment_id,
            payment_signature: verifySubscriptionPaymentDto.payment_signature,
            status: 'PAYMENT_SUCCESS',
          },
        },
        {
          where: { id: verifySubscriptionPaymentDto.id },
        },
      );
      const subscription = await this.findOne(verifySubscriptionPaymentDto.id);
      this.eventEmitter.emit(
        'subscription.created',
        new SubscriptionCreatedEvent(subscription),
      );
      return subscription;
    }
    throw new BadRequestException('Payment verification failed');
  }
}
