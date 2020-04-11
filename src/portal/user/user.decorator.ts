import { createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const User = createParamDecorator((data, req: Request) => {
  // if route is protected, there is a user set in auth.middleware
  if (!!req.user) {
    return !!data ? req.user[data] : req.user;
  }
});
