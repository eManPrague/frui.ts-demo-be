import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { configService } from "./config/config.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix("api");

  // Whitelist poperty in DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // Disable etags
  app
    .getHttpAdapter()
    .getInstance()
    .set("etag", false);

  // Use swagger
  const options = new DocumentBuilder()
    .setTitle("Api Frui.TS demo")
    .setDescription("Api Frui.TS demo")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api/swagger", app, document);

  await app.listen(configService.getPort());
}
bootstrap();
