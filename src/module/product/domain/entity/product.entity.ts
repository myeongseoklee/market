import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { ProductStatus } from '../const/product.const';
import { EntityBase } from '@lib/core/base/entity.base';
import { BigIntTransformer } from '@lib/common/transformers/bigint.transformer';
import { DecimalTransformer } from '@lib/common/transformers/decimal.transformer';
import { ProductInventory } from './product-inventory.entity';
import { Transaction } from '@module/transaction/domain/entity/transaction.entity';
import { Member } from '@module/member/domain/entity/member.entity';

interface CreateProductProps {
  sellerId: bigint;
  name: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Entity('products')
export class Product extends EntityBase {
  @PrimaryColumn({
    name: 'product_id',
    type: 'bigint',
    generated: 'increment',
    comment: '제품 ID',
    transformer: new BigIntTransformer(),
  })
  productId: bigint;


  @OneToOne(() => ProductInventory, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' })
  inventory: ProductInventory;

  @OneToMany(() => Transaction, (transaction) => transaction.product, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' })
  transactions: Transaction[];

  @Column({
    name: 'seller_id',
    type: 'bigint',
    nullable: false,
    comment: '판매자 ID',
    transformer: new BigIntTransformer(),
  })
  sellerId: bigint;

  @ManyToOne(() => Member, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'seller_id', referencedColumnName: 'memberId' })
  seller: Member;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '제품명',
  })
  name: string;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    comment: '제품 가격',
    transformer: new DecimalTransformer(),
  })
  price: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ProductStatus,
    nullable: false,
    default: ProductStatus.SELLING,
    comment: '제품 상태',
  })
  status: (typeof ProductStatus)[keyof typeof ProductStatus];

  static create(props: CreateProductProps): Product {
    const product = new Product();
    const now = new Date();
    product.sellerId = props.sellerId;
    product.name = props.name;
    product.price = props.price;
    product.status = ProductStatus.SELLING;
    product.createdAt = props?.createdAt ?? now;
    product.updatedAt = props?.updatedAt ?? now;
    return product;
  }

  purchase(quantity: number, inventory: ProductInventory) {
    if (!this.canPurchase(quantity, inventory)) {
      throw new Error('구매할 수 없는 상품입니다.');
    }

    inventory.decreaseStock(quantity);
    if (inventory.isSoldOut()) {
      this.markAsReserving(inventory);
    }
    this.updatedAt = new Date();
  }

  private canPurchase(quantity: number, inventory: ProductInventory): boolean {
    return this.status === ProductStatus.SELLING && inventory.quantity >= quantity;
  }

  markAsReserving(inventory: ProductInventory) {
    if (this.status !== ProductStatus.SELLING) {
      throw new Error('판매중인 상품만 예약중 상태로 변경할 수 있습니다.');
    }
    if (!inventory.isSoldOut()) {
      throw new Error('재고가 남아있는 상품은 예약중 상태로 변경할 수 없습니다.');
    }
    this.updateStatus(ProductStatus.RESERVING);
  }

  markAsCompleted(inventory: ProductInventory, allSaleTransactions: Transaction[]) {
    if (this.status !== ProductStatus.RESERVING) {
      throw new Error('예약중인 상품만 완료 상태로 변경할 수 있습니다.');
    }
    if (!inventory.isSoldOut()) {
      throw new Error('재고가 남아있는 상품은 완료 상태로 변경할 수 없습니다.');
    }
    if (allSaleTransactions.length !== inventory.originalQuantity) {
      throw new Error('모든 거래가 완료된 상품만 완료 상태로 변경할 수 있습니다.');
    }
    this.updateStatus(ProductStatus.COMPLETED);
  }

  resumeSelling(inventory: ProductInventory) {
    if (this.status !== ProductStatus.RESERVING) {
      throw new Error('예약중인 상품만 판매중 상태로 변경할 수 있습니다.');
    }
    if (inventory.isSoldOut()) {
      throw new Error('재고가 없는 상품은 판매중 상태로 변경할 수 없습니다.');
    }
    this.updateStatus(ProductStatus.SELLING);
  }

  private updateStatus(status: (typeof ProductStatus)[keyof typeof ProductStatus]) {
    this.status = status;
    this.updatedAt = new Date();
  }

  isSeller(memberId: bigint) {
    return this.sellerId === memberId;
  }
}
