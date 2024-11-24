import { Module } from '@nestjs/common';
import { ProductModule } from '@module/product/product.module';
import { TransactionModule } from '@module/transaction/transaction.module';
import { MemberModule } from '@module/member/member.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import appConfig from '@config/app.config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { validationSchema } from '@config/validation.schema';
import ormConfig from '@config/orm.config';
import authConfig from '@config/auth.config';
import { AuthModule } from '@module/auth/auth.module';
// TODO: 모듈 인스턴스 싱글톤 유지 점검
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [appConfig, ormConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (token: ConfigType<typeof ormConfig>) =>
        token as TypeOrmModuleAsyncOptions,
      inject: [ormConfig.KEY],
    }),
    MemberModule,
    ProductModule,
    TransactionModule,
    AuthModule,
  ],
})
export class AppModule {}
