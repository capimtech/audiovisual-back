import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAnimalServiceAttachment1750683209991
  implements MigrationInterface
{
  name = 'CreateAnimalServiceAttachment1750683209991';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "animal_service_attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "attachmentId" character varying NOT NULL, "animalServiceId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_43b4fc0e59f0064ebccb8884a3c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "isActive" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "animal_service_attachment" ADD CONSTRAINT "FK_86c71ad6f5c637bf3209ed70d2d" FOREIGN KEY ("animalServiceId") REFERENCES "animal_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "animal_service_attachment" DROP CONSTRAINT "FK_86c71ad6f5c637bf3209ed70d2d"`,
    );
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "isActive"`);
    await queryRunner.query(`DROP TABLE "animal_service_attachment"`);
  }
}
