import { Module, Global } from "@nestjs/common";

import AccountService from "./account.service";
import AccountController from "./account.controller";

@Global()
@Module({
  imports: [],
  providers: [AccountService],
  controllers: [AccountController],
})
export default class AccountModule {}
