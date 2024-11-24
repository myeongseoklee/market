import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../interface/dto/create-transaction.dto';
import { ITransactionRepository } from './port/itransaction.repository';
import { DIToken } from '../transaction.di-token';
import { ProductStatus } from '@module/product/domain/const/product.const';
import { TransactionStatus } from '../domain/const/transaction.const';
import { Transaction } from '../domain/entity/transaction.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { ServiceBase } from '@lib/core/base/service.base';
import { Product } from '@module/product/domain/entity/product.entity';
import { QueryFailedError } from 'typeorm';
import { RetryUtil } from '@lib/common/utils/retriy.util';
import { ProductInventory } from '@module/product/domain/entity/product-inventory.entity';

@Injectable()
export class TransactionService extends ServiceBase {
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 100; // milliseconds

  constructor(
    @Inject(DIToken.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async createTransaction(buyerId: bigint, createTransactionDto: CreateTransactionDto) {
    const { productId, purchasePrice } = createTransactionDto;

    const queryRunner = this.getConnection();
    await queryRunner.startTransaction();
    try {
      const product = await queryRunner.manager.findOne(Product, {
        where: { productId },
      });

      if (!product) {
        throw new Error('존재하지 않는 상품입니다.');
      }

      // 1. SELECT 시점에 두 트랜잭션이 동일한 재고(1개)를 읽음
      // 2. 각각 구매 가능하다고 판단
      // 3. UPDATE 시점에 첫 번째 트랜잭션이 0으로 만든 후
      // 4. 두 번째 트랜잭션이 다시 차감하여 음수가 됨
      // 5. 결과적으로 재고가 부족한 상황에서 거래가 생성됨
      // 해결책: SELECT FOR UPDATE로 먼저 읽는 트랜잭션이 
      // 재고 확인부터 거래 생성까지 완료할 때까지
      // 다른 트랜잭션의 접근을 차단
      const inventory = await queryRunner.manager.findOne(ProductInventory, {
        where: { productId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!inventory) {
        throw new Error('재고가 없는 상품입니다.');
      }

      product.purchase(1, inventory);
      await queryRunner.manager.update(Product, product.productId.toString(), product);
      await queryRunner.manager.update(ProductInventory, inventory.productId.toString(), inventory);

      const transaction = Transaction.create({
        productId,
        buyerId,
        sellerId: product.sellerId,
        purchasePrice,
      });
      await queryRunner.manager.insert(Transaction, transaction);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async approveSale(memberId: bigint, transactionId: bigint) {
    console.log('memberId', memberId)
    const transaction = await this.transactionRepository.getTransactionById(transactionId);
    if (!transaction) {
      throw new Error('존재하지 않는 거래입니다.');
    }
    if (!transaction.isSeller(memberId)) {
      console.log('transaction', transaction)
      throw new Error('판매자만 판매승인을 할 수 있습니다.');
    }
    transaction.approveSale();
    await this.transactionRepository.updateTransaction(transaction);
  }

  async confirmPurchase(buyerId: bigint, transactionId: bigint) {
    // 예약중인 상품의 거래가 모두 구매확정되면 상품 상태를 완료로 변경
    // 이때, 다수의 구매자가 동시에 구매확정을 하는 경우 동시성 문제 발생 가능하므로 낙관적 락 사용
    return RetryUtil.executeWithRetry(
      this.MAX_RETRIES,
      this.RETRY_DELAY,
      () => this.executeConfirmPurchase(buyerId, transactionId)
    );
  }

  private async executeConfirmPurchase(buyerId: bigint, transactionId: bigint) {
    const queryRunner = this.getConnection();
    try {
      await queryRunner.startTransaction();

      const transaction = await this.findBuyerTransaction(buyerId, transactionId, queryRunner);
      await this.updateTransactionStatus(transaction, queryRunner);
      await this.markProductAsCompletedIfNeeded(transaction, queryRunner);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async findBuyerTransaction(
    buyerId: bigint,
    transactionId: bigint,
    queryRunner: QueryRunner,
  ) {
    const transaction = await queryRunner.manager.findOne(Transaction, {
      where: { transactionId, buyerId },
    });

    if (!transaction) {
      throw new Error('존재하지 않는 거래입니다.');
    }

    return transaction;
  }

  private async updateTransactionStatus(transaction: Transaction, queryRunner: QueryRunner) {
    transaction.confirmPurchase();
    try {
      await queryRunner.manager.update(Transaction, transaction.transactionId.toString(), transaction);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new Error('이미 처리된 거래입니다. 다시 시도해주세요.');
      }
      throw err;
    }
  }

  private async markProductAsCompletedIfNeeded(transaction: Transaction, queryRunner: QueryRunner) {
    const product = await queryRunner.manager.findOne(Product, {
      where: { productId: transaction.productId }
    });

    if (product?.status === ProductStatus.RESERVING) {
      const allSaleTransactions = await queryRunner.manager.findBy(Transaction, {
        sellerId: transaction.sellerId,
        status: TransactionStatus.PURCHASE_CONFIRMATION
      });

      const inventory = await queryRunner.manager.findOne(ProductInventory, {
        where: { productId: product.productId }
      });

      if (!inventory) {
        throw new Error('재고가 없는 상품입니다.');
      }

      product.markAsCompleted(inventory, allSaleTransactions);
      await queryRunner.manager.update(Product, product.productId.toString(), product);
    }
  }

  async getReservationList(memberId: bigint, page: number, size: number) {
    const buyTransactions = await this.transactionRepository.getTransactionsByBuyerId(memberId);
    const sellTransactions = await this.transactionRepository.getTransactionsBySellerId(memberId);

    return {
      buy: buyTransactions.filter(tx => tx.isReservation()).slice((page - 1) * size, page * size),
      sell: sellTransactions.filter(tx => tx.isReservation()).slice((page - 1) * size, page * size),
    };
  }

  async getPurchaseList(buyerId: bigint, page: number, size: number) {
    const transactions = await this.transactionRepository.getTransactionsByBuyerId(buyerId);
    return transactions.filter(tx => tx.isActiveOrCompleted()).slice((page - 1) * size, page * size);
  }

  async getTransactionsOfSellerAndBuyer(memberId: bigint, sellerId: bigint, buyerId: bigint, page: number, size: number) {
    // 거래 당사자가 아니면 거래내역 조회 불가
    if (memberId !== sellerId && memberId !== buyerId) {
      return [];
    }
    const transactions = [
      ...(await this.transactionRepository.getTransactionsOfSellerAndBuyer(sellerId, buyerId)),
      ...(await this.transactionRepository.getTransactionsOfSellerAndBuyer(buyerId, sellerId)),
    ];
    return transactions.sort((a, b) => Number(b.transactionId) - Number(a.transactionId)).slice((page - 1) * size, page * size);
  }
}
