import { Module, Global } from "@nestjs/common";
import { ConfigService, configService } from "./config.service";

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: configService,
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
