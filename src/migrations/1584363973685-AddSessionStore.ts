import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddSessionStore1584363973685 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "sessions",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isGenerated: false,
            length: "255",
          },
          {
            name: "expired_at",
            type: "timestamp",
          },
          {
            name: "json",
            type: "text",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("sessions");
  }
}
