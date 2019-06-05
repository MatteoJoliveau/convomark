import {MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey} from "typeorm";

export class CreateMessages1559752161090 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const messageTable = new Table({
            name: 'messages',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid'
                },
                {
                    name: 'messageId',
                    type: 'bigint',
                    isNullable: false,
                },
                {
                    name: 'chatUsername',
                    type: 'varchar',
                    isNullable: false
                }
            ]
        });
        await queryRunner.createTable(messageTable, true);
        await queryRunner.createIndex(messageTable, new TableIndex({
            name: 'index_messages_message_id',
            columnNames: ['messageId', 'chatUsername'],
            isUnique: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropIndex('messages', 'index_messages_message_id');
        await queryRunner.dropTable('messages');
    }
}
