import { Module, NestModule, MiddlewareConsumer, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import User from "../user/user.entity";
import AuthMiddleware from "../session/auth.middleware";
import Payment from "./payment.entity";
import PaymentService from "./payment.service";
import PaymentController from "./payment.controller";
import Category from "../category/category.entity";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Payment, Category])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export default class PaymentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PaymentController);
  }
}
