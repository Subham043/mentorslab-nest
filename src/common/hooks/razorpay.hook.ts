import { Injectable } from '@nestjs/common';
import { Orders } from 'razorpay/dist/types/orders';
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils';
import RazorpayClass from 'razorpay';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Razorpay = require('razorpay');

@Injectable()
export class RazorpayHook {
  private readonly key_id = 'rzp_test_C6y0UqyRMkEWqB';
  private readonly key_secret = '69unAv9G1o0izHpG8uD43VXy';
  private readonly razorpay: RazorpayClass;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: this.key_id,
      key_secret: this.key_secret,
    });
  }

  async generateOrderId(
    amount: number,
    receipt: string,
  ): Promise<Orders.RazorpayOrder> {
    return await this.razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: receipt,
    });
  }

  verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    signature: string,
  ): boolean {
    return validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
      signature,
      this.key_secret,
    );
  }
}
