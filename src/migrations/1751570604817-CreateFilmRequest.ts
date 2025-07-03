import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFilmRequest1751570604817 implements MigrationInterface {
  name = 'CreateFilmRequest1751570604817';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "film_request_attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "attachmentId" character varying NOT NULL, "filmRequestId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9935558869480fd1b50936edcb8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "film_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productionName" character varying NOT NULL, "productionCompany" character varying NOT NULL, "legalRepresentative" character varying NOT NULL, "productionType" character varying NOT NULL, "status" character varying NOT NULL, "crewSize" integer NOT NULL, "filmingSchedule" character varying NOT NULL, "requestedLocations" character varying NOT NULL, "synopsis" character varying NOT NULL, "filmingPlan" character varying NOT NULL, "equipmentList" character varying NOT NULL, "estimatedImpacts" character varying NOT NULL, "municipalSupportRequired" boolean NOT NULL, "municipalSupportDetails" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_4713f3b65424cf0cbee1b0e96c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "film_request_attachment" ADD CONSTRAINT "FK_a3622ab6dca43117b69a7d0a4ca" FOREIGN KEY ("filmRequestId") REFERENCES "film_requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "film_request_attachment" DROP CONSTRAINT "FK_a3622ab6dca43117b69a7d0a4ca"`,
    );
    await queryRunner.query(`DROP TABLE "film_requests"`);
    await queryRunner.query(`DROP TABLE "film_request_attachment"`);
  }
}
