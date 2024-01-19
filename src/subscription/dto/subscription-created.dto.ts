import { Subscription } from '../entities/subscription.entity';

export class SubscriptionCreatedEvent {
  data: Subscription;
  constructor(data: Subscription) {
    this.data = data;
  }
}
