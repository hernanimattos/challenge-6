import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddTransactionInCategory1607191623181
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'categories',
      new TableColumn({
        name: 'transaction_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'categories',
      new TableForeignKey({
        columnNames: ['transaction_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'transactions',
        name: 'CategoryTransaction',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropForeignKey('categories', 'TransactionCategory');
    queryRunner.dropColumn('catecories', 'transaction_id');
  }
}
