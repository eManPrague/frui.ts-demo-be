import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from "typeorm-transactional-cls-hooked";

// This two methods are required, otherwise
// @Transactional decorator wont work!
initializeTransactionalContext();
patchTypeORMRepositoryWithBaseRepository();

import * as ormconfig from "./ormconfig";

import PortalModule from "./portal/portal.module";

import { ConfigModule } from "./config/config.module";

export function DatabaseOrmModule(): DynamicModule {
  // we could load the configuration from dotEnv here,
  // but typeORM cli would not be able to find the configuration file.
  return TypeOrmModule.forRoot(ormconfig);
}

@Module({
  imports: [ConfigModule, DatabaseOrmModule(), PortalModule],
})
export class AppModule {}
