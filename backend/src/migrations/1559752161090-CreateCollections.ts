import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateCollections1559752161090 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const collectionTable = new Table({
      name: 'collections',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'uuid',
        },
        {
          name: 'title',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'slug',
          type: 'varchar',
          isNullable: false,
          isUnique: true,
        },
        {
          name: 'userId',
          type: 'bigint',
          isNullable: false,
        },
        {
          name: 'shortId',
          type: 'varchar',
          isNullable: false,
          isUnique: true,
        },
      ],
    });
    await queryRunner.createTable(collectionTable, true);
    await queryRunner.createIndex(
      collectionTable,
      new TableIndex({
        name: 'index_collections_title',
        columnNames: ['title'],
      }),
    );
    await queryRunner.createIndex(
      collectionTable,
      new TableIndex({
        name: 'index_collections_slug_unique',
        columnNames: ['slug'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      collectionTable,
      new TableIndex({
        name: 'index_collections_shortid',
        columnNames: ['shortId'],
      }),
    );

    await queryRunner.createForeignKey(
      collectionTable,
      new TableForeignKey({
        name: 'fk_collection_user',
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const collectionTable = await queryRunner.getTable('collections');

    if (collectionTable) {
      await queryRunner.dropForeignKeys(
        collectionTable,
        collectionTable.foreignKeys,
      );
      await queryRunner.dropIndices(collectionTable, collectionTable.indices);
      await queryRunner.dropTable(collectionTable);
    }
  }
}
