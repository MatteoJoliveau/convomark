import {MigrationInterface, QueryRunner} from 'typeorm';
import {TableUnique} from 'typeorm/schema-builder/table/TableUnique';
import {pipe, uniqBy, xor, map} from 'lodash/fp';
import {Bookmark} from '../models';

export class MakeBookmarksUnique1561922614238 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.removeDuplicateBookmarks(queryRunner);
    const bookmarkTable = await queryRunner.getTable('bookmarks');
    if (bookmarkTable) {
      await queryRunner.createUniqueConstraint(
        bookmarkTable,
        new TableUnique({
          name: 'UQ_bookmarks_link_collection',
          columnNames: ['messageLink', 'collectionId'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const bookmarkTable = await queryRunner.getTable('bookmarks');
    if (bookmarkTable) {
      await queryRunner.dropUniqueConstraints(
        bookmarkTable,
        bookmarkTable.uniques,
      );
    }
  }

  private async removeDuplicateBookmarks(
    queryRunner: QueryRunner,
  ): Promise<void> {
    const results: {
      id: string;
      collectionId: string;
      messageLink: string;
    }[] = await queryRunner.manager.query(`
            select b.id, b."collectionId", b."messageLink"
            from bookmarks b
                     join (select "messageLink", "collectionId", count(*)
                           from bookmarks
                           group by "messageLink", "collectionId"
                           having count(*) > 1) bg
                          on b."messageLink" = bg."messageLink";
        `);
    const exceeding = pipe(
      uniqBy(({messageLink, collectionId}) => `${messageLink}-${collectionId}`),
      xor(results),
      map('id'),
    )(results);

    if (exceeding && exceeding.length > 0) {
      await queryRunner.manager.delete(Bookmark, exceeding);
    }
  }
}
