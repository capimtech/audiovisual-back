import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAnimals1745489601621 implements MigrationInterface {
  name = 'CreateAnimals1745489601621';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "animals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "nickname" character varying, "genre" character varying, "birthDate" TIMESTAMP, "earpiece" character varying, "function" character varying, "registerDate" TIMESTAMP, "isRegistered" boolean NOT NULL DEFAULT false, "registerNumber" character varying, "isChipped" boolean NOT NULL DEFAULT false, "chipNumber" character varying, "rationControl" boolean NOT NULL DEFAULT false, "species" character varying, "race" character varying, "category" character varying, "coat" character varying, "availableForSale" boolean NOT NULL DEFAULT false, "marketValue" numeric(10,2), "saleValue" numeric(10,2), "minimumSaleValue" numeric(10,2), "repTird" boolean NOT NULL DEFAULT false, "registerType" character varying, "invoiceClose" character varying, "generation" character varying, "location" character varying, "status" character varying, "farmId" uuid, "ownerId" uuid, "companyId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_6154c334bbb19186788468bce5c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "owners" DROP CONSTRAINT "PK_7a2c79668fd14097bae2ad67607"`,
    );
    await queryRunner.query(
      `ALTER TABLE "owners" ADD CONSTRAINT "PK_42838282f2e6b216301a70b02d6" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "owners" DROP COLUMN "cpfCnpj"`);
    await queryRunner.query(
      `ALTER TABLE "owners" ADD "cpfCnpj" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD CONSTRAINT "FK_4a9e83d9d18562222b973e92d42" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD CONSTRAINT "FK_aa19cda92647e0b8e781c40ff43" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD CONSTRAINT "FK_d325f353f4cf75d84c7f4f5ff76" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "animals" DROP CONSTRAINT "FK_d325f353f4cf75d84c7f4f5ff76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" DROP CONSTRAINT "FK_aa19cda92647e0b8e781c40ff43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" DROP CONSTRAINT "FK_4a9e83d9d18562222b973e92d42"`,
    );
    await queryRunner.query(`ALTER TABLE "owners" DROP COLUMN "cpfCnpj"`);
    await queryRunner.query(
      `ALTER TABLE "owners" ADD "cpfCnpj" character varying(14)`,
    );
    await queryRunner.query(
      `ALTER TABLE "owners" DROP CONSTRAINT "PK_42838282f2e6b216301a70b02d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "owners" ADD CONSTRAINT "PK_7a2c79668fd14097bae2ad67607" PRIMARY KEY ("id", "cpfCnpj")`,
    );
    await queryRunner.query(`DROP TABLE "animals"`);
  }
}
