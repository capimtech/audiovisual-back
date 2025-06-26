import { MigrationInterface, QueryRunner } from "typeorm";

export class RelationAnimalOwners1747402347122 implements MigrationInterface {
    name = 'RelationAnimalOwners1747402347122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animals" DROP CONSTRAINT "FK_d325f353f4cf75d84c7f4f5ff76"`);
        await queryRunner.query(`CREATE TABLE "animal_owner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "animalId" uuid NOT NULL, "ownerId" uuid NOT NULL, "percentage" double precision, "isResponsible" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_3102b730361cdaf71e7d383042d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "animals" ADD "ownerId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'ARTISTA'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'ARTISTA'`);
        await queryRunner.query(`ALTER TABLE "animal_owner" ADD CONSTRAINT "FK_cbb704f8312d06c3dd59d901413" FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "animal_owner" ADD CONSTRAINT "FK_7448e18cf11e21e569e086b1fd7" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "animals" ADD CONSTRAINT "FK_d325f353f4cf75d84c7f4f5ff76" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animals" DROP CONSTRAINT "FK_d325f353f4cf75d84c7f4f5ff76"`);
        await queryRunner.query(`ALTER TABLE "animal_owner" DROP CONSTRAINT "FK_7448e18cf11e21e569e086b1fd7"`);
        await queryRunner.query(`ALTER TABLE "animal_owner" DROP CONSTRAINT "FK_cbb704f8312d06c3dd59d901413"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CASEIRO'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CASEIRO'`);
        await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "animals" ADD "ownerId" uuid`);
        await queryRunner.query(`DROP TABLE "animal_owner"`);
        await queryRunner.query(`ALTER TABLE "animals" ADD CONSTRAINT "FK_d325f353f4cf75d84c7f4f5ff76" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
