import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddPhotoToUser1559989993095 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn("users", new TableColumn({
            name: "photoUrl",
            type: "varchar",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn("users", "photoUrl");
    }

}
