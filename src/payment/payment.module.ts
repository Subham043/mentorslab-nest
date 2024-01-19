import { Module } from '@nestjs/common';
import { PaymentService } from './service/payment.service';
import { PaymentController } from './controller/payment.controller';
import { Payment } from './entities/payment.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [SequelizeModule.forFeature([Payment])],
})
export class PaymentModule {}
