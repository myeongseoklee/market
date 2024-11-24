import { InsertResult } from 'typeorm';
import { Product } from '../../domain/entity/product.entity';
import { IRepository } from '@lib/core/base/repository.interface';

export interface IProductRepository extends IRepository<Product> {
  getProductById(productId: bigint): Promise<Product | null>;
  getProducts(page: number, size: number): Promise<Product[]>;
  insertProduct(product: Product): Promise<InsertResult>;
}
