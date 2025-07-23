import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that do not have decorators
      forbidNonWhitelisted: true, // throws error if non-whitelisted properties are present
      transform: true, // auto-transform payloads to DTO instances
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Sui Faucet')
    .setDescription('Sui Faucet API')
    .setVersion('1.0')
    .addTag('sui')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
