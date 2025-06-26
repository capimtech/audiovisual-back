import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFarmStatus1747865031350 implements MigrationInterface {
    name = 'AddFarmStatus1747865031350'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animals" DROP CONSTRAINT "FK_d325f353f4cf75d84c7f4f5ff76"`);
        await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "farms" ADD "status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CASEIRO'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CASEIRO'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'ARTISTA'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'ARTISTA'`);
        await queryRunner.query(`ALTER TABLE "farms" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "animals" ADD "ownerId" uuid`);
        await queryRunner.query(`ALTER TABLE "animals" ADD CONSTRAINT "FK_d325f353f4cf75d84c7f4f5ff76" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
