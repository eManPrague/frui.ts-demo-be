import { Module, NestModule, MiddlewareConsumer, RequestMethod, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import SessionController from "./session.controller";
import User from "../user/user.entity";
import SessionService from "./session.service";
import AuthMiddleware from "./auth.middleware";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export default class SessionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: "session", method: RequestMethod.POST })
      .forRoutes(SessionController);
  }
}
