import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RepositoryBase } from '@lib/core/base/repository.base';
import { ProductInventory } from '@module/product/domain/entity/product-inventory.entity';
import { IProductInventoryRepository } from '@module/product/application/port/iproduct-inventory.repository';

@Injectable()
export class ProductInventoryRepository
  extends RepositoryBase<ProductInventory>
  implements IProductInventoryRepository {
  constructor(
    @InjectRepository(ProductInventory)
    private readonly repository: Repository<ProductInventory>,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async insertProductInventory(productInventory: ProductInventory) {
    return await this.repository.insert(productInventory);
  }
}
