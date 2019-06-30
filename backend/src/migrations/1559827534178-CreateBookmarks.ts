import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateBookmarks1559827534178 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const bookmarkTable = new Table({
      name: 'bookmarks',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'uuid',
        },
        {
          name: 'messageLink',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'userId',
          type: 'bigint',
          isNullable: false,
        },
        {
          name: 'collectionId',
          type: 'uuid',
          isNullable: false,
        },
        {
          name: 'name',
          type: 'varchar',
          isNullable: true,
        },
      ],
    });
    await queryRunner.createTable(bookmarkTable, true);
    await queryRunner.createIndex(
      bookmarkTable,
      new TableIndex({
        name: 'index_bookmarks_message_link',
        columnNames: ['messageLink'],
      }),
    );
    await queryRunner.createForeignKey(
      bookmarkTable,
      new TableForeignKey({
        name: 'fk_bookmark_user',
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      bookmarkTable,
      new TableForeignKey({
        name: 'fk_bookmark_collection',
        columnNames: ['collectionId'],
        referencedTableName: 'collections',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const bookmarkTable = await queryRunner.getTable('bookmarks');
    if (bookmarkTable) {
      await queryRunner.dropForeignKeys(
        bookmarkTable,
        bookmarkTable.foreignKeys,
      );
      await queryRunner.dropIndices(bookmarkTable, bookmarkTable.indices);
      await queryRunner.dropTable(bookmarkTable);
    }
  }
}
