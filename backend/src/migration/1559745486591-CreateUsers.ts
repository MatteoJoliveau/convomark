import {MigrationInterface, QueryRunner, Table, TableIndex} from "typeorm";

export class CreateUsers1559745486591 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const userTable = new Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'bigint',
                    isPrimary: true
                },
                {
                    name: 'firstName',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'lastName',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'username',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'languageCode',
                    type: 'varchar',
                    isNullable: true,
                }
            ]
        });
        await queryRunner.createTable(userTable, true);

        await queryRunner.createIndex('users', new TableIndex({
            name: 'index_users_username',
            columnNames: ['username']
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropIndex("users", "index_users_username");
        await queryRunner.dropTable("users");
    }

}
