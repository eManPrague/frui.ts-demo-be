import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";

import { ApiProperty } from "@nestjs/swagger";
import User from "../user/user.entity";
import Category from "../category/category.entity";

@Entity({
  name: "payments",
})
export default class Payment extends BaseEntity {
  // tslint:disable:variable-name
  @ApiProperty({
    description: "Internal ID",
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Payment name",
    required: true,
  })
  @Column()
  name: string;

  @ApiProperty({
    description: "Payment date",
    required: true,
  })
  @Column({ type: "timestamp" })
  paid_at: Date;

  @ApiProperty({
    description: "Price",
    required: true,
  })
  @Column({ type: "decimal", precision: 12, scale: 2 })
  price: number;

  @ApiProperty({
    description: "User reference",
    required: true,
  })
  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: Promise<User>;

  @ApiProperty({
    description: "Category reference",
    required: true,
  })
  @Column()
  category_id: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: "category_id", referencedColumnName: "id" })
  category: Promise<Category>;

  @ApiProperty({
    description: "",
    required: true,
  })
  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @ApiProperty({
    description: "",
    required: true,
  })
  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
