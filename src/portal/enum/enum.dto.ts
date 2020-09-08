import { ApiProperty } from "@nestjs/swagger";

class PaymentTypeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  coefficient: number;
}

export default class EnumerationResponseDto {
  @ApiProperty({
    isArray: true,
    type: PaymentTypeDto,
  })
  payment_types: PaymentTypeDto[];
}
