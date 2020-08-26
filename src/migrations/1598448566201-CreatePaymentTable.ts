import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreatePaymentTable1598448566201 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "payments",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment" as "increment",
          },
          {
            name: "user_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "category_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "name",
            type: "varchar",
            length: "30",
            isNullable: false,
          },
          {
            name: "paid_at",
            type: "timestamp",
            default: "NOW()",
          },
          {
            name: "price",
            type: "decimal(12,2)",
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
      })
    );

    await queryRunner.createForeignKey(
      "payments",
      new TableForeignKey({
        name: "payments_category_fk",
        referencedColumnNames: ["id"],
        referencedTableName: "categories",
        columnNames: ["category_id"],
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "payments",
      new TableForeignKey({
        name: "payments_user_fk",
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        columnNames: ["user_id"],
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      })
    );

    await queryRunner.createIndex(
      "payments",
      new TableIndex({
        name: "payment_user_idx",
        columnNames: ["user_id"],
      })
    );

    await queryRunner.createIndex(
      "payments",
      new TableIndex({
        name: "payment_category_idx",
        columnNames: ["category_id"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey("payments", "payments_user_fk");
    await queryRunner.dropForeignKey("payments", "payments_category_fk");
    await queryRunner.dropTable("payments");
  }
}
