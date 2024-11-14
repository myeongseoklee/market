import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CoreModule } from './core/core.module';
import { TransactionModule } from './transaction/transaction.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [MemberModule, ProductModule, TransactionModule, CoreModule],
  providers: [],
})
export class AppModule {}
