import "reflect-metadata";
import { Logger, RequestMethod, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

process.env.TZ = process.env.DEFAULT_TZ ?? "Asia/Tbilisi";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = new Logger("Bootstrap");
  app.useLogger(logger);
  app.use(cookieParser());
  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ limit: "10mb", extended: true }));
  app.setGlobalPrefix("api/v1", {
    exclude: [{ path: "health", method: RequestMethod.ALL }]
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  logger.log(`API listening on port ${port}`);
}

bootstrap();
