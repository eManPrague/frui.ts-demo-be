import { Module, NestModule, MiddlewareConsumer, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import User from "../user/user.entity";
import AuthMiddleware from "../session/auth.middleware";
import Category from "./category.entity";
import CategoryService from "./category.service";
import CategoryController from "./category.controller";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export default class CategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(CategoryController);
  }
}
