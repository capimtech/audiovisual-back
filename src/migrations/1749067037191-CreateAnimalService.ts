import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAnimalService1749067037191 implements MigrationInterface {
    name = 'CreateAnimalService1749067037191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "animal_services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "description" text NOT NULL, "date" date NOT NULL, "value" numeric(10,2) NOT NULL, "notes" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "animal_id" uuid, CONSTRAINT "PK_57ee6dd0119aafca0234788f8e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "animal_services" ADD CONSTRAINT "FK_6c35be3d9fdace684b1c16a3d27" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animal_services" DROP CONSTRAINT "FK_6c35be3d9fdace684b1c16a3d27"`);
        await queryRunner.query(`DROP TABLE "animal_services"`);
    }

}
