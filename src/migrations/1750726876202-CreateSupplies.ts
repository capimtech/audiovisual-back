import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSupplies1750726876202 implements MigrationInterface {
  name = 'CreateSupplies1750726876202';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "supplies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "category" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, "description" text, "measureUnit" character varying, "stockQuantity" integer, "minimumQuantity" integer, "unitPrice" numeric(10,2), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_49c0dc272c9fcf2723bdfd48be1" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "supplies"`);
  }
}
