import { Module, Provider } from '@nestjs/common';
import { ProductService } from './application/product.service';
import { ProductController } from './interface/product.controller';
import { ProductRepository } from './infra/db/product.repository';
import { Product } from './domain/entity/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DIToken } from './product.di-token';
import { ProductInventoryRepository } from './infra/db/product-inventory.repository';
import { ProductInventory } from './domain/entity/product-inventory.entity';

const controllers = [ProductController];
const services = [ProductService];
const repositories: Provider[] = [
  { provide: DIToken.PRODUCT_REPOSITORY, useClass: ProductRepository },
  { provide: DIToken.PRODUCT_INVENTORY_REPOSITORY, useClass: ProductInventoryRepository },
];

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductInventory])],
  controllers: controllers,
  providers: [...services, ...repositories],
  exports: [...services],
})
export class ProductModule { }
