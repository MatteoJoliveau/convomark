import {MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey} from "typeorm";

export class CreateCollections1559827534178 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const collectionTable = new Table({
            name: 'collections',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid'
                },
                {
                    name: 'title',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'slug',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'userId',
                    type: 'bigint',
                    isNullable: false,
                    isUnique: true
                }
            ]
        });
        await queryRunner.createTable(collectionTable, true);
        await queryRunner.createIndex(collectionTable, new TableIndex({
            name: 'index_collections_title',
            columnNames: ['title']
        }));
        await queryRunner.createIndex(collectionTable, new TableIndex({
            name: 'index_collections_slug_unique',
            columnNames: ['slug'],
            isUnique: true
        }));
        await queryRunner.createForeignKey(collectionTable, new TableForeignKey({
            name: 'fk_collection_user',
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE'
        }));

        const joinTable = new Table({
            name: 'bookmarks_collections',
            columns: [
                {
                    name: 'bookmarkId',
                    type: 'uuid',
                    isPrimary: true,
                    isNullable: false
                },
                {
                    name: 'collectionId',
                    type: 'uuid',
                    isPrimary: true,
                    isNullable: false
                }
            ]
        });

        await queryRunner.createTable(joinTable, true);
        const bookmarkKey = new TableForeignKey({
            name: 'fk_bookmarks_collections_bookmark',
            columnNames: ['bookmarkId'],
            referencedTableName: 'bookmarks',
            referencedColumnNames: ['id']
        });
        const collectionKey = new TableForeignKey({
            name: 'fk_bookmarks_collections_collection',
            columnNames: ['collectionId'],
            referencedTableName: 'collections',
            referencedColumnNames: ['id']
        });
        await queryRunner.createForeignKeys(joinTable, [bookmarkKey, collectionKey]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const [joinTable, collectionTable] = await queryRunner.getTables(['bookmarks_collections', 'collections']);
        
        await queryRunner.dropForeignKeys(joinTable, joinTable.foreignKeys);
        await queryRunner.dropTable(joinTable);
        
        
        await queryRunner.dropForeignKeys(collectionTable, collectionTable.foreignKeys);
        await queryRunner.dropIndices(collectionTable, collectionTable.indices);
        await queryRunner.dropTable(collectionTable);
    }

}
