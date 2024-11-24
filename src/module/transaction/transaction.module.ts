import { Module } from '@nestjs/common';
import { Transaction } from './domain/entity/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './application/transaction.service';
import { TransactionController } from './interface/transaction.controller';
import { DIToken } from './transaction.di-token';
import { TransactionRepository } from './infra/db/transaction.repository';

const controllers = [TransactionController];
const services = [TransactionService];
const repositories = [{
  provide: DIToken.TRANSACTION_REPOSITORY,
  useClass: TransactionRepository,
}];

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [...controllers],
  providers: [...services, ...repositories],
})
export class TransactionModule { }
