import { Module, NestModule, MiddlewareConsumer, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import AuthMiddleware from "../session/auth.middleware";
import EnumController from "./enum.controller";

@Global()
@Module({
  controllers: [EnumController],
})
export default class EnumModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(EnumController);
  }
}
