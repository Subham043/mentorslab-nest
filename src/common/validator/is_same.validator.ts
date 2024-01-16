import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@ValidatorConstraint({ name: 'IsSameRule', async: true })
@Injectable()
export class IsSameRule implements ValidatorConstraintInterface {
  async validate(value: string, validationArguments?: ValidationArguments) {
    const dto = validationArguments.object as CreateUserDto;
    if (value !== dto.password) return false;
    return true;
  }

  defaultMessage() {
    return `Both the passwords must match`;
  }
}

export function IsSame(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsSame',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsSameRule,
    });
  };
}
