import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { IsSame } from 'src/common/validator/is_same.validator';
import { IsEmailUnique } from 'src/common/validator/is_email_unique.validator';
import { IsPhoneUnique } from 'src/common/validator/is_phone_unique.validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsEmailUnique()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneUnique()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsSame()
  confirm_password: string;
}
