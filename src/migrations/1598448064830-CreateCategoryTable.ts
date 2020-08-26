import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateCategoryTable1598448064830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "categories",
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
            name: "type", // Debit / Credit
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
            name: "desc",
            type: "text",
            isNullable: true,
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
      "categories",
      new TableForeignKey({
        name: "categories_user_fk",
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        columnNames: ["user_id"],
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      })
    );

    await queryRunner.createIndex(
      "categories",
      new TableIndex({
        name: "user_idx",
        columnNames: ["user_id"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey("categories", "categories_user_fk");
    await queryRunner.dropTable("categories");
  }
}
