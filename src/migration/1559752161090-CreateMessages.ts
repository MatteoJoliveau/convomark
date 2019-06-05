import {MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey} from "typeorm";

export class CreateMessages1559752161090 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const userTable = new Table({
            name: 'messages',
            columns: [
                {
                    name: 'id',
                    type: 'bigint',
                    isPrimary: true
                },
                {
                    name: 'from_id',
                    type: 'bigint',
                    isNullable: false
                }
            ]
        });
        await queryRunner.createTable(userTable, true);

        await queryRunner.createForeignKey("messages", new TableForeignKey({
            columnNames: ["from_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable("messages");
        if (table) {
            const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf("from_id") !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey(table, foreignKey);
            }
            await queryRunner.dropTable(table);
        }
    }

}
