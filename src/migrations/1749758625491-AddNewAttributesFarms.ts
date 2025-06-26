import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewAttributesFarms1749758625491 implements MigrationInterface {
  name = 'AddNewAttributesFarms1749758625491';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "farms" ADD "isOwned" boolean`);

    await queryRunner.query(
      `UPDATE "farms" SET "isOwned" = false WHERE "isOwned" IS NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "farms" ALTER COLUMN "isOwned" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "farms" ADD "adminContactName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" ADD "adminContactPhone" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" ADD "adminContactEmail" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" ADD "financialContactName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" ADD "financialContactPhone" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" ADD "financialContactEmail" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "farms" DROP COLUMN "financialContactEmail"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" DROP COLUMN "financialContactPhone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" DROP COLUMN "financialContactName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" DROP COLUMN "adminContactEmail"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" DROP COLUMN "adminContactPhone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" DROP COLUMN "adminContactName"`,
    );
    await queryRunner.query(`ALTER TABLE "farms" DROP COLUMN "isOwned"`);
  }
}
