import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserRoles1747335217895 implements MigrationInterface {
    name = 'UpdateUserRoles1747335217895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CASEIRO'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'ARTISTA'`);
    }

}
