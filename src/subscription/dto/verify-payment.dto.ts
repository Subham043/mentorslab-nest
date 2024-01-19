import { IsNotEmpty, IsNumber } from 'class-validator';
import { VerifyPaymentDto } from 'src/payment/dto/verify-payment.dto';

export class VerifySubscriptionPaymentDto extends VerifyPaymentDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
