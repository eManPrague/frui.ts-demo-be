import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import * as bcrypt from "bcryptjs";

export enum UserRole {
  Admin = 1,
  HomeOwner = 2,
  Normal = 3,
}

/**
 * User
 */
@Entity({
  name: "users",
})
export default class User extends BaseEntity {
  // tslint:disable:variable-name
  @ApiProperty({
    description: "id",
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "",
    required: true,
  })
  @Column()
  email: string;

  @Exclude()
  @Column({ name: "encrypted_password" })
  encryptedPassword: string;

  @ApiProperty({
    description: "",
    required: true,
  })
  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @ApiProperty({
    description: "",
    required: true,
  })
  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;

  @ApiProperty({
    description: "Role",
    required: true,
  })
  @Column({ type: "smallint" })
  role: number;

  /**
   * @returns Role name string
   */
  get roleName(): string {
    return UserRole[this.role];
  }

  /**
   * Check if password is valid for this user.
   * @param password Password
   * @returns boolean
   */
  validatePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.encryptedPassword);
  }

  /**
   * Set new password & encrypt it.
   * @param password New password
   */
  setPassword(password: string) {
    this.encryptedPassword = bcrypt.hashSync(password, 10);
  }
}
