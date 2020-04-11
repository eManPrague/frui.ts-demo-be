import {
  Controller,
  Post,
  Get,
  Inject,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  Session,
  Delete,
} from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";

import User from "../user/user.entity";
import SessionService, { PortalSession } from "./session.service";
import SessionDto from "./session.dto";
import { User as UserDecorator } from "../user/user.decorator";

@ApiTags("Session")
@Controller("session")
export default class SessionController {
  constructor(@Inject(SessionService) private readonly sessionService: SessionService) {}

  @ApiOperation({ summary: "Login user" })
  @Post()
  @SerializeOptions({
    groups: ["user_detail"],
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 201, description: "Login user", type: User })
  login(@Body() sessionDto: SessionDto, @Session() session: PortalSession) {
    return this.sessionService.login(sessionDto, session);
  }

  @ApiOperation({ summary: "Current user" })
  @Get()
  @SerializeOptions({
    groups: ["user_detail"],
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 200, description: "Return current user", type: User })
  current(@UserDecorator() user: User) {
    return user;
  }

  @ApiOperation({ summary: "Logout user" })
  @Delete()
  @ApiResponse({ status: 200, description: "Return current user", type: User })
  logout(@Session() session: PortalSession) {
    return this.sessionService.logout(session);
  }
}
