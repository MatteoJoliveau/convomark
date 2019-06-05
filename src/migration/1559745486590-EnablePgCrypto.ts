import {MigrationInterface, QueryRunner, Table, TableIndex} from "typeorm";

export class CreateUsers1559745486591 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    }
    
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP EXTENSION IF EXISTS pgcrypto');
    }

}
