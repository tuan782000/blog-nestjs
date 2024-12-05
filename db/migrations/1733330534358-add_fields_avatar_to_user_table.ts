import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsAvatarToUserTable1733330534358 implements MigrationInterface {
    name = 'AddFieldsAvatarToUserTable1733330534358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }

}
