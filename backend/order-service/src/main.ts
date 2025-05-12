import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Order Service API')
    .setDescription('The Order Service API description')
    .setVersion('1.0')
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start the server
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Order service is running on port ${port}`);
}

bootstrap(); 