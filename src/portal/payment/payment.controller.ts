import { Controller, Post, Get, Inject, Body, UseInterceptors, Query, ParseIntPipe, HttpCode } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";

import Payment from "./payment.entity";
import PaymentService from "./payment.service";
import { User as UserDecorator } from "../user/user.decorator";
import PaginatedSerializeInterceptor from "src/utils/paginated.interceptor";
import PaymentDto from "./payment.dto";

@ApiTags("Payment")
@Controller("payments")
export default class PaymentController {
  constructor(@Inject(PaymentService) private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: "List of payments" })
  @Get()
  @UseInterceptors(PaginatedSerializeInterceptor)
  @ApiResponse({ status: 200, description: "List of payments", type: Payment })
  list(
    @Query("limit", new ParseIntPipe()) limit: number,
    @Query("offset", new ParseIntPipe()) offset: number,
    @UserDecorator("id") userId: number
  ) {
    return this.paymentService.list(userId, limit || 10, offset || 0);
  }

  @ApiOperation({ summary: "Create payment" })
  @Post()
  @ApiResponse({ status: 201 })
  @HttpCode(201)
  create(@UserDecorator("id") userId, @Body() data: PaymentDto) {
    return this.paymentService.create(userId, data);
  }
}
