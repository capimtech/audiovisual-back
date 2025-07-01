import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { Env } from './env';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // <-- Make sure to use <NestExpressApplication>
  app.set('query parser', 'extended');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.enableCors();
  app.use(helmet());

  const options = new DocumentBuilder()
    .setTitle('APL Ranch')
    .setDescription('API APL Ranch - Gestão de fazendas')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);

  const configService123 = app.get<ConfigService<Env>>(ConfigService);
  const port = configService123.get('PORT');

  await app.listen(port);
}
bootstrap();
