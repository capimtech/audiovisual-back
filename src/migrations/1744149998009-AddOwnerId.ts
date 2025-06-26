import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOwnerId1744149998009 implements MigrationInterface {
    name = 'AddOwnerId1744149998009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "owners" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cpfCnpj" character varying NOT NULL, "name" character varying NOT NULL, "fullName" character varying, "phone" character varying, "email" character varying, "status" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_f3a204390c33da1396d300af3cf" UNIQUE ("cpfCnpj"), CONSTRAINT "PK_42838282f2e6b216301a70b02d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "owners" DROP CONSTRAINT "PK_42838282f2e6b216301a70b02d6"`);
        await queryRunner.query(`ALTER TABLE "owners" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "owners" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "owners" ADD CONSTRAINT "PK_42838282f2e6b216301a70b02d6" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "owners" DROP CONSTRAINT "UQ_f3a204390c33da1396d300af3cf"`);
        await queryRunner.query(`ALTER TABLE "owners" DROP COLUMN "cpfCnpj"`);
        await queryRunner.query(`ALTER TABLE "owners" ADD "cpfCnpj" character varying(14) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "owners" DROP CONSTRAINT "PK_42838282f2e6b216301a70b02d6"`);
        await queryRunner.query(`ALTER TABLE "owners" ADD CONSTRAINT "PK_7a2c79668fd14097bae2ad67607" PRIMARY KEY ("id", "cpfCnpj")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "owners" DROP CONSTRAINT "PK_7a2c79668fd14097bae2ad67607"`);
        await queryRunner.query(`ALTER TABLE "owners" ADD CONSTRAINT "PK_42838282f2e6b216301a70b02d6" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "owners" DROP COLUMN "cpfCnpj"`);
        await queryRunner.query(`ALTER TABLE "owners" ADD "cpfCnpj" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "owners" ADD CONSTRAINT "UQ_f3a204390c33da1396d300af3cf" UNIQUE ("cpfCnpj")`);
        await queryRunner.query(`ALTER TABLE "owners" DROP CONSTRAINT "PK_42838282f2e6b216301a70b02d6"`);
        await queryRunner.query(`ALTER TABLE "owners" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "owners" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "owners" ADD CONSTRAINT "PK_42838282f2e6b216301a70b02d6" PRIMARY KEY ("id")`);
        await queryRunner.query(`DROP TABLE "owners"`);
    }

}
