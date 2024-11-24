import { Product } from '@module/product/domain/entity/product.entity';

export interface IProductService {
  getProductById(productId: bigint): Promise<Product>;
  updateStatus(product: Product): Promise<void>;
}
