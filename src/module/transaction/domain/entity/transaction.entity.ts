import { BigIntTransformer } from '@lib/common/transformers/bigint.transformer';
import { DecimalTransformer } from '@lib/common/transformers/decimal.transformer';
import { EntityBase } from '@lib/core/base/entity.base';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, VersionColumn } from 'typeorm';
import { TransactionStatus } from '../const/transaction.const';
import { Product } from '@module/product/domain/entity/product.entity';
import { Member } from '@module/member/domain/entity/member.entity';
interface CreateTransactionProps {
  productId: bigint;
  buyerId: bigint;
  sellerId: bigint;
  purchasePrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Entity('transactions')
export class Transaction extends EntityBase {
  @VersionColumn()
  version: number;

  @PrimaryColumn({
    name: 'transaction_id',
    type: 'bigint',
    generated: 'increment',
    comment: '거래 고유 ID',
    transformer: new BigIntTransformer(),
  })
  transactionId: bigint;

  @Column({
    name: 'product_id',
    type: 'bigint',
    comment: '제품 ID',
    transformer: new BigIntTransformer(),
  })
  productId: bigint;

  @ManyToOne(() => Product, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' })
  product: Product;

  @Column({
    name: 'buyer_id',
    type: 'bigint',
    comment: '구매자 ID',
    transformer: new BigIntTransformer(),
  })
  buyerId: bigint;

  @ManyToOne(() => Member, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'buyer_id', referencedColumnName: 'memberId' })
  buyer: Member;

  @Column({
    name: 'seller_id',
    type: 'bigint',
    comment: '판매자 ID',
    transformer: new BigIntTransformer(),
  })
  sellerId: bigint;

  @ManyToOne(() => Member, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'seller_id', referencedColumnName: 'memberId' })
  seller: Member;

  @Column({
    name: 'purchase_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '구매 가격',
    transformer: new DecimalTransformer(),
  })
  purchasePrice: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PURCHASE_REQUEST,
    comment: '거래 상태',
  })
  status: (typeof TransactionStatus)[keyof typeof TransactionStatus];


  static create(props: CreateTransactionProps): Transaction {
    if (props.buyerId === props.sellerId) {
      throw new Error('구매자와 판매자는 같을 수 없습니다.');
    }
    if (props.purchasePrice <= 0) {
      throw new Error('구매 가격은 0보다 커야 합니다.');
    }

    const transaction = new Transaction();
    const now = new Date();
    transaction.productId = props.productId;
    transaction.buyerId = props.buyerId;
    transaction.sellerId = props.sellerId;
    transaction.purchasePrice = props.purchasePrice;
    transaction.status = TransactionStatus.PURCHASE_REQUEST;
    transaction.createdAt = props.createdAt ?? now;
    transaction.updatedAt = props.updatedAt ?? now;
    return transaction;
  }

  private validateTransactionNotCompleted() {
    if (this.status === TransactionStatus.PURCHASE_CONFIRMATION) {
      throw new Error('이미 완료된 거래입니다.');
    }
  }

  approveSale() {
    this.validateTransactionNotCompleted();
    if (this.status !== TransactionStatus.PURCHASE_REQUEST) {
      throw new Error('구매 요청 상태가 아닙니다.');
    }
    this.status = TransactionStatus.SALE_APPROVAL;
    this.updatedAt = new Date();
  }

  confirmPurchase() {
    this.validateTransactionNotCompleted();
    if (this.status !== TransactionStatus.SALE_APPROVAL) {
      throw new Error('판매 승인 상태가 아닙니다.');
    }
    this.status = TransactionStatus.PURCHASE_CONFIRMATION;
    this.updatedAt = new Date();
  }

  isActiveOrCompleted() {
    return this.isPurchaseConfirmation() || this.isSaleApproval();
  }

  isReservation() {
    return this.isPurchaseRequest();
  }

  isPurchaseConfirmation() {
    return this.status === TransactionStatus.PURCHASE_CONFIRMATION;
  }

  isSaleApproval() {
    return this.status === TransactionStatus.SALE_APPROVAL;
  }

  isPurchaseRequest() {
    return this.status === TransactionStatus.PURCHASE_REQUEST;
  }

  isSeller(memberId: bigint) {
    console.log('this.sellerId', this.sellerId)
    console.log('memberId', memberId)
    return this.sellerId === memberId;
  }

  isBuyer(memberId: bigint) {
    return this.buyerId === memberId;
  }
}
