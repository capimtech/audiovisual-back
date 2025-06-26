import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterAnimals1749216027538 implements MigrationInterface {
  name = 'AlterAnimals1749216027538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "animal_attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "attachmentId" character varying NOT NULL, "animalId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_fb4e4515fb0825fc335b788683f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "animals" ADD "attachmentId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "animals" ADD CONSTRAINT "UQ_a768fecf7d91de63dc7a8123a25" UNIQUE ("attachmentId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "animal_attachment" ADD CONSTRAINT "FK_89d3cc342a30b32194afd383c17" FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD CONSTRAINT "FK_a768fecf7d91de63dc7a8123a25" FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "animals" DROP CONSTRAINT "FK_a768fecf7d91de63dc7a8123a25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animal_attachment" DROP CONSTRAINT "FK_89d3cc342a30b32194afd383c17"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" DROP CONSTRAINT "UQ_a768fecf7d91de63dc7a8123a25"`,
    );
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "attachmentId"`);
    await queryRunner.query(`DROP TABLE "animal_attachment"`);
  }
}
