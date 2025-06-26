import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCompanies1743712564669 implements MigrationInterface {
  name = 'SeedCompanies1743712564669';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // verify if the companies already exists, if not create it
    await queryRunner.query(
      `INSERT INTO companies (name)
            VALUES
                ('EMPRESA TESTE');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM companies WHERE name IN (
            'EMPRESA TESTE'
          );`,
    );
  }
}
