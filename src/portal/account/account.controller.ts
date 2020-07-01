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

    for (let i = 0; i < 20; i++) {
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
    if (id < 0 || id >= 20) {
      throw new HttpException("Invoice not found.", HttpStatus.NOT_FOUND);
    }

    return this.generateAccount(id);
  }

  @ApiOperation({ summary: "Account detail with operations" })
  @Get("special/:id")
  detailWithError(@Param("id") id: number) {
    if (Math.random() < 0.5) {
      throw new HttpException("Account not found.", 404);
    }

    return this.generateAccount(id);
  }

  private generateAccount(id: number) {
    const operations = [];

    for (let i = 0; i < 30; i++) {
      const type = Math.random() < 0.5 ? "income" : "outcome";

      operations.push({
        type,
        amount: parseInt(`${Math.random() * 10000}`),
      });
    }

    return {
      id,
      name: `custom account - ${id}`,
      operations,
    };
  }
}
