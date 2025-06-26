import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewAttributesOwners1750103698375 implements MigrationInterface {
  name = 'AddNewAttributesOwners1750103698375';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "condition"`);
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "father"`);
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "mother"`);
    await queryRunner.query(
      `ALTER TABLE "animals" DROP COLUMN "paternalGrandmother"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" DROP COLUMN "paternalGrandfather"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" DROP COLUMN "maternalGrandmother"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" DROP COLUMN "maternalGrandfather"`,
    );
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "animalFather"`);
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "animalMother"`);
    await queryRunner.query(
      `ALTER TABLE "animals" DROP COLUMN "animalPaternalGrandmother"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" DROP COLUMN "animalPaternalGrandfather"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" DROP COLUMN "animalMaternalGrandmother"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" DROP COLUMN "animalMaternalGrandfather"`,
    );
    await queryRunner.query(`ALTER TABLE "farms" DROP COLUMN "isOwned"`);
    await queryRunner.query(
      `ALTER TABLE "farms" DROP COLUMN "adminContactName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" DROP COLUMN "adminContactPhone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" DROP COLUMN "adminContactEmail"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" DROP COLUMN "financialContactName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" DROP COLUMN "financialContactPhone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" DROP COLUMN "financialContactEmail"`,
    );
    await queryRunner.query(
      `ALTER TABLE "owners" ADD "adminContactName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "owners" ADD "adminContactPhone" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "owners" ADD "adminContactEmail" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "owners" ADD "financialContactName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "owners" ADD "financialContactPhone" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "owners" ADD "financialContactEmail" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "condition" character varying NOT NULL DEFAULT 'DESCONHECIDA'`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "father" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "mother" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "paternalGrandmother" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "paternalGrandfather" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "maternalGrandmother" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "maternalGrandfather" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "animals" DROP COLUMN "maternalGrandfather"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" DROP COLUMN "maternalGrandmother"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" DROP COLUMN "paternalGrandfather"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" DROP COLUMN "paternalGrandmother"`,
    );
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "mother"`);
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "father"`);
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "condition"`);
    await queryRunner.query(
      `ALTER TABLE "owners" DROP COLUMN "financialContactEmail"`,
    );
    await queryRunner.query(
      `ALTER TABLE "owners" DROP COLUMN "financialContactPhone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "owners" DROP COLUMN "financialContactName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "owners" DROP COLUMN "adminContactEmail"`,
    );
    await queryRunner.query(
      `ALTER TABLE "owners" DROP COLUMN "adminContactPhone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "owners" DROP COLUMN "adminContactName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" ADD "financialContactEmail" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" ADD "financialContactPhone" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" ADD "financialContactName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" ADD "adminContactEmail" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" ADD "adminContactPhone" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" ADD "adminContactName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" ADD "isOwned" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "animalMaternalGrandfather" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "animalMaternalGrandmother" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "animalPaternalGrandfather" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "animalPaternalGrandmother" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "animalMother" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "animalFather" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "maternalGrandfather" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "maternalGrandmother" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "paternalGrandfather" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "paternalGrandmother" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "mother" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "father" character varying`,
    );
  }
}
