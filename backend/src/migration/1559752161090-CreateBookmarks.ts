import {MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey} from "typeorm";

export class CreateBookmarkss1559752161090 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const bookmarkTable = new Table({
            name: 'bookmarks',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid'
                },
                {
                    name: 'messageLink',
                    type: 'varchar',
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: 'userId',
                    type: 'bigint',
                    isNullable: false,
                }
            ]
        });
        await queryRunner.createTable(bookmarkTable, true);
        await queryRunner.createIndex(bookmarkTable, new TableIndex({
            name: 'index_bookmarks_message_link',
            columnNames: ['messageLink'],
            isUnique: true,
        }));
        await queryRunner.createForeignKey(bookmarkTable, new TableForeignKey({
            name: 'fk_bookmark_user',
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const bookmarkTable = await queryRunner.getTable('bookmarks');
        if (bookmarkTable) {
            await queryRunner.dropForeignKeys(bookmarkTable, bookmarkTable.foreignKeys);
            await queryRunner.dropIndices(bookmarkTable, bookmarkTable.indices);
            await queryRunner.dropTable(bookmarkTable);
        }
    }
}
