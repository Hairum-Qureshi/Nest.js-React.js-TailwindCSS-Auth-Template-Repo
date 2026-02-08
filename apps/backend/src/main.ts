import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'assets'), {
    prefix: '/assets/',
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log('Nest.js Server successfully started');
}
bootstrap();
