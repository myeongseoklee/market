import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../domain/entity/product.entity';
import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IProductRepository } from '@module/product/application/port/iproduct.repository';
import { RepositoryBase } from '@lib/core/base/repository.base';

@Injectable()
export class ProductRepository
  extends RepositoryBase<Product>
  implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async getProductById(productId: bigint) {
    return await this.repository.findOne({ where: { productId }, relations: ['seller'] });
  }

  async getProducts(page: number, size: number) {
    return await this.repository.find({
      relations: ['seller'],
      skip: (page - 1) * size,
      take: size,
    });
  }

  async insertProduct(product: Product) {
    return await this.repository.insert(product);
  }
}
