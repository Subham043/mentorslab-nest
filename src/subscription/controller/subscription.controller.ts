import { Controller, Post, Body } from '@nestjs/common';
import { SubscriptionService } from '../service/subscription.service';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { FormDataRequest } from 'nestjs-form-data';

@Controller({
  path: 'subscription',
  version: '1',
})
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Public()
  @Post()
  @FormDataRequest()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }
}
