import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { PaymentType } from "../category/category.entity";
import EnumerationResponseDto from "./enum.dto";

@ApiTags("Enumerations")
@Controller("enums")
export default class CategoryController {
  @ApiOperation({ summary: "Enumerations" })
  @Get()
  @ApiResponse({ status: 200, description: "List of enums", type: EnumerationResponseDto })
  enums() {
    return {
      payment_types: [
        { id: PaymentType.Debit, name: "Debit", coefficient: -1 },
        { id: PaymentType.Credit, name: "Credit", coefficient: 1 },
      ],
    };
  }
}
