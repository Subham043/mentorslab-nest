import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { JoiPipeValidationException } from 'nestjs-joi';

@Catch()
export class MainExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception instanceof JoiPipeValidationException
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR;

    const httpMessage =
      exception instanceof HttpException
        ? exception.message
        : exception instanceof JoiPipeValidationException
          ? exception.message
          : 'Internal Server Error';

    const joiValidationErroBody =
      exception instanceof JoiPipeValidationException
        ? {
            error: exception.joiValidationError.details.map((item) => {
              return { message: item.message, context: item.context };
            }),
          }
        : {};
    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      message: httpMessage,
      ...joiValidationErroBody,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
