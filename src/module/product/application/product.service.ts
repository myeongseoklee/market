import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from './port/iproduct.repository';
import { Product } from '../domain/entity/product.entity';
import { DIToken } from '../product.di-token';
import { CreateProductDto } from '../interface/dto/create-product.dto';
import { ProductInventory } from '../domain/entity/product-inventory.entity';
import { IProductInventoryRepository } from './port/iproduct-inventory.repository';
import { AuthProvider } from '@module/auth/domain/entity/auth-provider.entity';

@Injectable()
export class ProductService {
  constructor(
    @Inject(DIToken.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(DIToken.PRODUCT_INVENTORY_REPOSITORY)
    private readonly productInventoryRepository: IProductInventoryRepository,
  ) { }

  async getProductById(productId: bigint) {
    const product = await this.productRepository.getProductById(productId);
    if (!product) {
      throw new Error('제품을 찾을 수 없습니다.');
    }
    return product;
  }

  async getProducts(page: number, size: number) {
    return await this.productRepository.getProducts(page, size);
  }

  async createProduct(authProvider: AuthProvider, createProductDto: CreateProductDto) {
    const product = Product.create({
      sellerId: authProvider.memberId,
      name: createProductDto.name,
      price: createProductDto.price,
    });
    const { identifiers: [{ productId }] } = await this.productRepository.insertProduct(product);
    const inventory = ProductInventory.create({
      productId,
      quantity: createProductDto.quantity,
    });
    await this.productInventoryRepository.insertProductInventory(inventory);
  }
}
