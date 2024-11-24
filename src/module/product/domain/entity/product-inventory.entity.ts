import { Column, Entity, PrimaryColumn } from 'typeorm';
import { EntityBase } from '@lib/core/base/entity.base';
import { BigIntTransformer } from '@lib/common/transformers/bigint.transformer';

interface CreateProductInventoryProps {
  productId: bigint;
  quantity: number;
}

@Entity('product_inventories')
export class ProductInventory extends EntityBase {
  @PrimaryColumn({
    name: 'product_id',
    type: 'bigint',
    comment: '상품 ID',
    transformer: new BigIntTransformer(),
  })
  productId: bigint;

  @Column({
    name: 'quantity',
    type: 'int',
    comment: '현재 재고 수량',
  })
  quantity: number;

  @Column({
    name: 'original_quantity',
    type: 'int',
    comment: '원래 재고 수량',
  })
  originalQuantity: number;

  private validateProductId(productId: bigint) {
    if (!productId) {
      throw new Error('상품 ID는 필수입니다.');
    }
    if (productId <= 0) {
      throw new Error('유효하지 않은 상품 ID입니다.');
    }
  }

  private validateQuantity(quantity: number) {
    if (quantity === undefined || quantity === null) {
      throw new Error('수량은 필수입니다.');
    }
    if (!Number.isInteger(quantity)) {
      throw new Error('수량은 정수여야 합니다.');
    }
    if (quantity <= 0) {
      throw new Error('수량은 0보다 커야 합니다.');
    }
  }

  static create(props: CreateProductInventoryProps): ProductInventory {
    // 입력값 검증
    const inventory = new ProductInventory();
    inventory.productId = props.productId;
    inventory.quantity = props.quantity;
    inventory.originalQuantity = props.quantity;
    inventory.validateProductId(props.productId);
    inventory.validateQuantity(props.quantity);

    return inventory;
  }

  decreaseStock(quantity: number): void {
    this.validateQuantity(quantity);

    if (this.quantity < quantity) {
      throw new Error(`재고를 차감할 수 없습니다. (현재 재고: ${this.quantity.toLocaleString()}개)`);
    }
    this.quantity -= quantity;
  }

  increaseStock(quantity: number): void {
    this.validateQuantity(quantity);
    const newQuantity = this.quantity + quantity;
    this.quantity = newQuantity;
  }

  isSoldOut(): boolean {
    return this.quantity === 0;
  }
} 