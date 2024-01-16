import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type TransformInterceptorResponse<T> = {
  statusCode: number;
  data: T;
};

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, TransformInterceptorResponse<T>>
{
  constructor(private type?: NonNullable<'query' | 'body' | 'param'>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<TransformInterceptorResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        data: data,
      })),
    );
  }
}
