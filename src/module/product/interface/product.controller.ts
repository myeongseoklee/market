import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from '../application/product.service';
import { routesV1 } from '@config/app.routes';
import { ParseBigIntPipe } from '@lib/core/pipes/parse-bigint.pipe';
import { AccessTokenGuard } from '@module/auth/guard/access-token.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAuthProvider } from '@module/auth/interface/decorator/member.decorator';
import { AuthProvider } from '@module/auth/domain/entity/auth-provider.entity';

@Controller(routesV1.version)
export class ProductController {
  constructor(private readonly productService: ProductService) { }
  /**
   * query
   */
  @Get(routesV1.product.get.getProductById)
  @HttpCode(HttpStatus.OK)
  getProductById(@Param('productId', new ParseBigIntPipe()) productId: bigint) {
    return this.productService.getProductById(productId);
  }

  @Get(routesV1.product.get.getProducts)
  @HttpCode(HttpStatus.OK)
  getProducts(@Query('page', new ParseIntPipe()) page: number, @Query('size', new ParseIntPipe()) size: number) {
    return this.productService.getProducts(page ?? 1, size ?? 10);
  }

  /**
   * command
   */
  // 1. 제품 등록과 구매는 회원만 가능합니다. 
  @UseGuards(AccessTokenGuard)
  @Post(routesV1.product.post.createProduct)
  @HttpCode(HttpStatus.CREATED)
  createProduct(@GetAuthProvider() authProvider: AuthProvider, @Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(authProvider, createProductDto);
  }
}
