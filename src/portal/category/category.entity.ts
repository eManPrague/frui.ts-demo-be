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

export enum PaymentType {
  Debit = 1,
  Credit = 2,
}

@Entity({
  name: "categories",
})
export default class Category extends BaseEntity {
  // tslint:disable:variable-name
  @ApiProperty({
    description: "Internal ID",
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Category name",
    required: true,
  })
  @Column()
  name: string;

  @ApiProperty({
    description: "Description",
  })
  @Column()
  desc: string;

  @ApiProperty({
    description: "Debit / Credit",
  })
  @Column()
  type: PaymentType;

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
