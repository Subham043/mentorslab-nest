import { Controller, Post, Body } from '@nestjs/common';
import { SubscriptionService } from '../service/subscription.service';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller({
  path: 'subscription',
  version: '1',
})
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }
}
