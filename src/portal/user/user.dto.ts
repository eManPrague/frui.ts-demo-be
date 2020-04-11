import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength, IsNumber, IsEmail } from "class-validator";

export default class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @MinLength(4)
  readonly password: string;
}
