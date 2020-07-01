import { Controller, Get, Param, HttpException, ParseIntPipe, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";

@ApiTags("Accounts controller")
@Controller("accounts")
export default class AccountController {
  @ApiOperation({ summary: "Account list" })
  @Get()
  @ApiResponse({ status: 201, description: "Accounts" })
  list() {
    const resp = [];

    for (let i = 0; i < parseInt(`${Math.random() * 100}`); i++) {
      resp.push({
        id: i,
        name: `custom account - ${i}`,
        created_at: new Date(),
      });
    }

    return resp;
  }

  @ApiOperation({ summary: "Account detail with operations" })
  @Get(":id")
  detail(@Param("id", new ParseIntPipe()) id: number) {
    return this.generateAccount(id);
  }

  @ApiOperation({ summary: "Account detail with operations" })
  @Get("special/:id")
  detailWithError(@Param("id") id: number) {
    return this.generateAccount(id, true);
  }

  private generateAccount(id: number, randomize = false) {
    const operations = [];

    // Sometimes crashes...
    if (Math.random() <= 0.3) {
      throw new HttpException("Account not found.", 404);
    }

    if (Math.random() <= 0.2) {
      throw new HttpException("Account not found.", HttpStatus.BAD_REQUEST);
    }

    // Empty account?
    if (Math.random() > 0.5) {
      for (let i = 0; i < parseInt(`${Math.random() * 100}`); i++) {
        const type = Math.random() < 0.5 ? "income" : "outcome";

        operations.push({
          type,
          amount: parseInt(`${Math.random() * 10000}`),
        });
      }
    }

    return {
      id,
      name: `custom account - ${id}`,
      operations,
    };
  }
}
