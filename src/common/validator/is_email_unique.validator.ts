import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

@ValidatorConstraint({ name: 'IsEmailUniqueRule', async: true })
@Injectable()
export class IsEmailUniqueRule implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async validate(value: string) {
    try {
      const user = await this.userModel.findOne({
        where: {
          email: value,
        },
      });
      if (user) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage() {
    return `Email is already taken`;
  }
}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsEmailUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsEmailUniqueRule,
    });
  };
}
