import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsAlphanumeric,
} from 'class-validator';
import {
  HasExtension,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsEmail()
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
  phone: string;

  @IsOptional()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsFile()
  @MaxFileSize(5e6)
  @HasExtension(['pdf'])
  cv: MemoryStoredFile;
}
