import { Module } from "@nestjs/common";

import SessionModule from "./session/session.module";

import { SessionModule as NestSessionModule, NestSessionOptions } from "nestjs-session";
import { ConfigService } from "../config/config.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "./session/session.entity";
import { Repository } from "typeorm";
import { TypeormStore } from "./session/typeorm_store.service";
import UserModule from "./user/user.module";
import CategoryModule from "./category/category.module";
import EnumModule from "./enum/enum.module";
import PaymentModule from "./payment/payment.module";

@Module({
  imports: [
    // Setup sessions but only for portal module
    NestSessionModule.forRootAsync({
      imports: [ConfigService, TypeOrmModule.forFeature([Session])],
      inject: ["ConfigService", "SessionRepository"],
      useFactory: async (config: ConfigService, repository: Repository<Session>): Promise<NestSessionOptions> => ({
        session: {
          resave: false,
          secret: config.sessionKey(),
          name: config.sessionName(),
          saveUninitialized: false,
          store: new TypeormStore(repository, {
            cleanupLimit: 2,
            limitSubquery: false,
            ttl: 86400,
          }),
        },
      }),
    }),
    SessionModule,
    UserModule,
    CategoryModule,
    EnumModule,
    PaymentModule,
  ],
})
export default class PortalModule {}
