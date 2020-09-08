import { Injectable, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import Payment from "./payment.entity";
import PaymentDto from "./payment.dto";
import Category from "../category/category.entity";

@Injectable()
export default class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) {}

  async list(userId: number, limit: number, offset: number) {
    if (Math.random() <= 0.1) {
      throw new HttpException("This very good random exception.", HttpStatus.BAD_REQUEST);
    }

    return {
      total: await this.paymentRepository.count({ where: { user_id: userId } }),
      items: await this.paymentRepository.find({ where: { user_id: userId }, take: limit, skip: offset }),
    };
  }

  async create(userId: number, data: PaymentDto) {
    const category = await this.categoryRepository.findOne({ where: { user_id: userId, id: data.category_id } });

    if (!category) {
      throw new HttpException("Category was not found.", HttpStatus.NOT_FOUND);
    }

    const instance = this.paymentRepository.create({
      ...data,
      user_id: userId,
    });

    return instance.save();
  }

  async update(userId: number, id: number, data: PaymentDto) {
    const item = await this.paymentRepository.findOne({
      where: { user_id: userId, id },
    });

    if (!item) {
      throw new HttpException("Payment was not found.", HttpStatus.NOT_FOUND);
    }

    Object.assign(item, data);
    return item.save();
  }

  async delete(userId: number, id: number) {
    const item = await this.paymentRepository.findOne({
      where: { user_id: userId, id },
    });

    if (!item) {
      throw new HttpException("Payment was not found.", HttpStatus.NOT_FOUND);
    }

    return item.remove();
  }
}
