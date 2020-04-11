import { Injectable, HttpException, HttpStatus, ValidationError, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import User, { UserRole } from "./user.entity";
import UserDto from "./user.dto";
import { Transactional } from "typeorm-transactional-cls-hooked";

@Injectable()
export default class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  /**
   * Find one user.
   *
   * @param id User id
   *
   * @returns Promise<User>
   */
  async findOne(id: number): Promise<User> {
    const instance = await this.userRepository.findOne(id);

    if (!instance) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    return instance;
  }

  @Transactional()
  async create(createUserDto: UserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    user.role = UserRole.HomeOwner;

    // Check email presence and raise error
    const existingEmail = await this.userRepository.count({ email: createUserDto.email });

    if (existingEmail) {
      const error: ValidationError = {
        target: createUserDto,
        property: "email",
        value: createUserDto.email,
        constraints: {
          unique: "Email must be unique",
        },
        children: [],
      };

      throw new BadRequestException([error]);
    }

    user.setPassword(createUserDto.password);

    return user.save();
  }
}
