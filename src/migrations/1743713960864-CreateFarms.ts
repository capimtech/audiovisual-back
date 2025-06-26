import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFarms1743713960864 implements MigrationInterface {
  name = 'CreateFarms1743713960864';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "farms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "company_id" uuid NOT NULL, "companyId" uuid, CONSTRAINT "PK_39aff9c35006b14025bba5a43d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "farms" ADD CONSTRAINT "FK_eacf91deb69dfe10df138ae9617" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "farms" DROP CONSTRAINT "FK_eacf91deb69dfe10df138ae9617"`,
    );
    await queryRunner.query(`DROP TABLE "farms"`);
  }
}
