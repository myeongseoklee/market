import { InsertResult } from 'typeorm';
import { ProductInventory } from '../../domain/entity/product-inventory.entity';

export interface IProductInventoryRepository {
  insertProductInventory(productInventory: ProductInventory): Promise<InsertResult>;
}
