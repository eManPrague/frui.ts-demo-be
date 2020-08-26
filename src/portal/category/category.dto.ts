import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsIn, IsString, IsOptional } from "class-validator";
import { PaymentType } from "./category.entity";

/**
 * Create category dto
 */
export default class CategoryDto {
  @ApiProperty({ description: "Value from ENUM - Category type" })
  @IsNotEmpty()
  @IsIn([PaymentType.Debit, PaymentType.Credit])
  @IsNumber()
  readonly type: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly desc: string;
}
