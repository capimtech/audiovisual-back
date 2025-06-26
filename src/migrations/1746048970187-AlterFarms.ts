import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFarms1746048970187 implements MigrationInterface {
  name = 'AlterFarms1746048970187';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "farms" ADD "ownerId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "farms" ADD CONSTRAINT "FK_2c9880c922f2211e47c3f074d5b" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "farms" DROP CONSTRAINT "FK_2c9880c922f2211e47c3f074d5b"`,
    );
    await queryRunner.query(`ALTER TABLE "farms" DROP COLUMN "ownerId"`);
  }
}
