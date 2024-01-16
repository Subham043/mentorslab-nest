import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'UniqueEmailRule', async: true })
@Injectable()
export class UniqueEmailRule implements ValidatorConstraintInterface {
  // constructor(private prisma: PrismaService) {}

  async validate(value: string, validationArguments?: ValidationArguments) {
    // try {
    //   const user = await this.prisma.user.findFirst({
    //     where: { email: value },
    //   });
    //   if (user) return false;
    // } catch (e) {
    //   return false;
    // }
    console.log(value, validationArguments);
    return false;
  }

  defaultMessage() {
    return `Email is already taken`;
  }
}

export function UniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UniqueEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniqueEmailRule,
    });
  };
}
