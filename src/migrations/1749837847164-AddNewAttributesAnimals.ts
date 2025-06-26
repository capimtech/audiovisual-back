import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewAttributesAnimals1749837847164
  implements MigrationInterface
{
  name = 'AddNewAttributesAnimals1749837847164';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "condition" character varying NOT NULL DEFAULT 'DESCONHECIDA'`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ALTER COLUMN "condition" DROP DEFAULT`,
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
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "animalFather" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "animalMother" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "animalPaternalGrandmother" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "animalPaternalGrandfather" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "animalMaternalGrandmother" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "animalMaternalGrandfather" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "animals" DROP COLUMN "animalMaternalGrandfather"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" DROP COLUMN "animalMaternalGrandmother"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" DROP COLUMN "animalPaternalGrandfather"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" DROP COLUMN "animalPaternalGrandmother"`,
    );
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "animalMother"`);
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "animalFather"`);
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
  }
}
