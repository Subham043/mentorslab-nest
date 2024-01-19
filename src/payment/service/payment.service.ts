import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
  ) {}

  async findAll(): Promise<Payment[]> {
    return await this.paymentModel.findAll();
  }

  async findOne(id: number): Promise<Payment> {
    return await this.paymentModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.paymentModel.destroy({
      where: {
        id,
      },
    });
  }
}
