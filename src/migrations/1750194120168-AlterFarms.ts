import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFarms1750194120168 implements MigrationInterface {
  name = 'AlterFarms1750194120168';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "farms" ADD "isOwned" boolean NOT NULL DEFAULT false`,
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
