import { Injectable } from '@nestjs/common';
import { IRepository } from './repository.interface';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export abstract class RepositoryBase<T> implements IRepository<T> {
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
