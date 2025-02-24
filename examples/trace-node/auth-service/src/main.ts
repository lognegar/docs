import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import OTEL_SDK from './otel/instrumentation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  OTEL_SDK.start();

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
