import { InsertResult, UpdateResult } from 'typeorm';
import { Transaction } from '../../domain/entity/transaction.entity';
import { IRepository } from '@lib/core/base/repository.interface';

export interface ITransactionRepository extends IRepository<Transaction> {
  /**
   * query
   */
  getTransactionById(transactionId: bigint): Promise<Transaction | null>;
  getTransactions(): Promise<Transaction[]>;
  getTransactionsBySellerId(sellerId: bigint): Promise<Transaction[]>;
  getTransactionsByBuyerId(buyerId: bigint): Promise<Transaction[]>;
  getTransactionsOfSellerAndBuyer(sellerId: bigint, buyerId: bigint): Promise<Transaction[]>;
  /**
   * command
   */
  insertTransaction(transaction: Transaction): Promise<InsertResult>;
  updateTransaction(transaction: Transaction): Promise<UpdateResult>;
}
