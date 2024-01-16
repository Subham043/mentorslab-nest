import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CreateAuthDto {
  @JoiSchema(Joi.string().email().required())
  email!: string;

  @JoiSchema(Joi.string().required())
  password!: string;
}
