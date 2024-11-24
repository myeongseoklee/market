import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export abstract class ServiceBase {
  constructor(protected readonly dataSource: DataSource) { }

  getConnection() {
    return this.dataSource.createQueryRunner();
  }
  async commitTransaction(queryRunner: QueryRunner) {
    await queryRunner.commitTransaction();
  }
  async rollbackTransaction(queryRunner: QueryRunner) {
    await queryRunner.rollbackTransaction();
  }
  async releaseConnection(queryRunner: QueryRunner) {
    await queryRunner.release();
  }
}
