import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { NestMiddleware, HttpStatus, Injectable, Inject } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

import SessionService from "./session.service";

@Injectable()
export default class AuthMiddleware implements NestMiddleware {
  constructor(@Inject(SessionService) private readonly sessionService: SessionService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.session?.userId) {
      // This method fails on error
      req.user = await this.sessionService.findById(req.session.userId);
      next();
    } else {
      throw new HttpException("Not authorized.", HttpStatus.UNAUTHORIZED);
    }
  }
}
