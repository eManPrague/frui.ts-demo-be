import {
  Controller,
  Post,
  Get,
  Inject,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  Delete,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";
import { PaymentType } from "../category/category.entity";

@ApiTags("Enumerations")
@Controller("enums")
export default class CategoryController {
  @ApiOperation({ summary: "Enumerations" })
  @Get()
  @ApiResponse({ status: 200, description: "List of enums" })
  enums() {
    return {
      payment_type: [
        { id: PaymentType.Debit, name: "Debit", coefficient: -1 },
        { id: PaymentType.Credit, name: "Credit", coefficient: 1 },
      ],
    };
  }
}
