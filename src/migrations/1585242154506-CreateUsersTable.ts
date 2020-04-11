import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";
import User, { UserRole } from "../portal/user/user.entity";

export class CreateUsersTable1585242154506 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "email",
            type: "varchar",
          },
          {
            name: "encrypted_password",
            type: "varchar",
          },
          {
            name: "role",
            type: "int",
            default: 1,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "NOW()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "NOW()",
          },
        ],
      }),
      true
    );

    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "IDX_ADMIN_USERUNIQ_EMAIL",
        columnNames: ["email"],
        isUnique: true,
      })
    );

    if (process.env.DEFAULT_USER_EMAIL && process.env.DEFAULT_USER_PASSWORD) {
      const user = queryRunner.manager.create<User>(User, {
        email: process.env.DEFAULT_USER_EMAIL,
        role: UserRole.Admin,
      });

      user.setPassword(process.env.DEFAULT_USER_PASSWORD);

      await queryRunner.manager.save(user);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("users");
  }
}
