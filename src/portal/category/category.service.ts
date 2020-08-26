import { Injectable, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import Category from "./category.entity";
import CategoryDto from "./category.dto";

@Injectable()
export default class CategoryService {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}

  async list(userId: number, limit: number, offset: number) {
    return {
      total: await this.categoryRepository.count({ where: { user_id: userId } }),
      items: await this.categoryRepository.find({ where: { user_id: userId }, take: limit, skip: offset }),
    };
  }

  async create(userId: number, data: CategoryDto) {
    const instance = this.categoryRepository.create({
      ...data,
      user_id: userId,
    });

    return instance.save();
  }
}
