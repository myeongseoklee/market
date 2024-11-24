import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entity/transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { ITransactionRepository } from '@module/transaction/application/port/itransaction.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryBase } from '@lib/core/base/repository.base';

@Injectable()
export class TransactionRepository extends RepositoryBase<Transaction> implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }
  /**
   * query
   */
  async getTransactionById(transactionId: bigint) {
    return await this.repository.findOne({
      where: { transactionId },
      relations: {
        product: true,
        buyer: true,
      },
    });
  }

  async getTransactions() {
    return await this.repository.find({
      order: {
        transactionId: 'DESC',
      },
    });
  }

  async getTransactionsBySellerId(sellerId: bigint) {
    return await this.repository.find({
      where: { sellerId },
      order: {
        transactionId: 'DESC',
      },
    });
  }

  async getTransactionsByBuyerId(buyerId: bigint) {
    return await this.repository.find({
      where: { buyerId },
      order: {
        transactionId: 'DESC',
      },
    });
  }

  async getTransactionsOfSellerAndBuyer(sellerId: bigint, buyerId: bigint) {
    return await this.repository.find({
      where: { sellerId, buyerId },
      order: {
        transactionId: 'DESC',
      },
    });
  }

  /**
   * command
   */
  async insertTransaction(transaction: Transaction) {
    return await this.repository.insert(transaction);
  }

  async updateTransaction(transaction: Transaction) {
    return await this.repository.update(transaction.transactionId.toString(), transaction);
  }
}
