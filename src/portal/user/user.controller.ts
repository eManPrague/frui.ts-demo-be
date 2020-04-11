import { Controller, Post, Inject, Body, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";

import User from "../user/user.entity";
import UserDto from "./user.dto";
import UserService from "./user.service";

@ApiTags("Users controller")
@Controller("users")
export default class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @ApiOperation({ summary: "Registration" })
  @Post()
  @SerializeOptions({
    groups: ["user_detail"],
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 201, description: "Create user", type: User })
  create(@Body() userData: UserDto) {
    return this.userService.create(userData);
  }
}
