import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

@ValidatorConstraint({ name: 'IsPhoneUniqueRule', async: true })
@Injectable()
export class IsPhoneUniqueRule implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async validate(value: string) {
    try {
      const user = await this.userModel.findOne({
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

export function IsPhoneUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsPhoneUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsPhoneUniqueRule,
    });
  };
}
