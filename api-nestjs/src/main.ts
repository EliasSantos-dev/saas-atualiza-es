import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para o Next.js e App Desktop
  app.enableCors();
  
  // Adicionar prefixo global opcional
  // app.setGlobalPrefix('api/v1');

  // Habilitar validação global de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`NestJS Backend running on: http://localhost:${port}`);
}
bootstrap();
