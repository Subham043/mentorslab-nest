import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { ValidationError, useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // wrap AppModule with UseContainer
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // app transformer
  app.useGlobalInterceptors(new TransformInterceptor());

  // app validations
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const result = {};
        validationErrors.forEach(
          (element) =>
            (result[element.property] = Object.values(element.constraints)),
        );

        throw new BadRequestException({ ...result });
      },
      whitelist: true,
      transform: true,
    }),
  );

  // app versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // app cookie
  app.use(cookieParser());

  // app compression
  app.use(compression());

  // app compression
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'style-src': ["'self'"],
          'script-src': ["'self'"],
          'font-src': ["'self'"],
          'object-src': ["'self'"],
          'img-src': ["'self'", process.env.CLIENT_URL],
          'frame-src': ["'self'", process.env.CLIENT_URL],
          'frame-ancestors': ["'self'", process.env.CLIENT_URL],
          'connect-src': ["'self'", process.env.CLIENT_URL],
          'form-action': ["'self'"],
        },
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      frameguard: {
        action: 'sameorigin',
      },
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      referrerPolicy: { policy: 'no-referrer' },
      hidePoweredBy: true,
      hsts: {
        maxAge: 15552000,
        includeSubDomains: true,
        preload: true,
      },
      xssFilter: true,
    }),
  );

  // app cors
  app.enableCors({
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'Range',
    ],
    origin: function (origin, callback) {
      const whitelist = [
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        process.env.CLIENT_URL,
      ];
      if (origin) {
        if (whitelist.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      } else callback(null, true);
    },
    credentials: true,
    exposedHeaders: 'Content-Length',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  });

  await app.listen(Number(process.env.PORT) || 8800);
}
bootstrap();
