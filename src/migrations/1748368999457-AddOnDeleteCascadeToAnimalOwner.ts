import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOnDeleteCascadeToAnimalOwner1748368999457 implements MigrationInterface {
    name = 'AddOnDeleteCascadeToAnimalOwner1748368999457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animal_owner" DROP CONSTRAINT "FK_cbb704f8312d06c3dd59d901413"`);
        await queryRunner.query(`ALTER TABLE "animal_owner" ADD CONSTRAINT "FK_cbb704f8312d06c3dd59d901413" FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animal_owner" DROP CONSTRAINT "FK_cbb704f8312d06c3dd59d901413"`);
        await queryRunner.query(`ALTER TABLE "animal_owner" ADD CONSTRAINT "FK_cbb704f8312d06c3dd59d901413" FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
