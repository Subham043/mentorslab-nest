import { PartialType } from '@nestjs/mapped-types';
import { VerifyPaymentDto } from './verify-payment.dto';

export class UpdatePaymentDto extends PartialType(VerifyPaymentDto) {}
