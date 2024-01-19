import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Subscription } from 'src/subscription/entities/subscription.entity';

@ValidatorConstraint({ name: 'IsSubscriptionPhoneUniqueRule', async: true })
@Injectable()
export class IsSubscriptionPhoneUniqueRule
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectModel(Subscription)
    private subscriptionModel: typeof Subscription,
  ) {}

  async validate(value: string) {
    try {
      const user = await this.subscriptionModel.findOne({
        where: {
          phone: value,
        },
      });
      if (user) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage() {
    return `Phone is already taken`;
  }
}

export function IsSubscriptionPhoneUnique(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsSubscriptionPhoneUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsSubscriptionPhoneUniqueRule,
    });
  };
}
