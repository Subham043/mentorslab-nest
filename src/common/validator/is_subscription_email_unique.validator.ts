import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Subscription } from 'src/subscription/entities/subscription.entity';

@ValidatorConstraint({ name: 'IsSubscriptionEmailUniqueRule', async: true })
@Injectable()
export class IsSubscriptionEmailUniqueRule
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectModel(Subscription)
    private subscriptionModel: typeof Subscription,
  ) {}

  async validate(value: string) {
    try {
      const subscription = await this.subscriptionModel.findOne({
        where: {
          email: value,
        },
      });
      if (subscription) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage() {
    return `Email is already taken`;
  }
}

export function IsSubscriptionEmailUnique(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsSubscriptionEmailUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsSubscriptionEmailUniqueRule,
    });
  };
}
