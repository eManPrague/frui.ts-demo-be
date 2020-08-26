import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsISO8601 } from "class-validator";

/**
 * Create category dto
 */
export default class PaymentDto {
  @ApiProperty({ description: "Category id" })
  @IsNotEmpty()
  @IsNumber()
  readonly category_id: number;

  @ApiProperty({ description: "Payment name" })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsISO8601()
  readonly paid_at: string;

  @ApiProperty()
  @IsNumber()
  readonly price: number;
}
