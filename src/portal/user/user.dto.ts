import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength, IsEmail } from "class-validator";

export default class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  readonly password: string;
}
