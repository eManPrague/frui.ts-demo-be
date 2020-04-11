import { Injectable, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import User from "../user/user.entity";
import { ConfigService } from "../../config/config.service";

export interface PortalSession {
  userId?: number;
}

@Injectable()
export default class SessionService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(ConfigService) private readonly configService: ConfigService
  ) {}

  async login({ email, password }: { email: string; password: string }, session: PortalSession): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    // Compare password
    if (!user || !user.validatePassword(password)) {
      throw new HttpException("Invalid password or email", HttpStatus.UNAUTHORIZED);
    }

    // Set session
    session.userId = user.id;

    return user;
  }

  logout(session: PortalSession): boolean {
    session.userId = undefined;
    return true;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new HttpException("Unauthorized!", HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
