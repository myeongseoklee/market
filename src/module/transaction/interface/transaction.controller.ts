import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
  Param,
  Patch,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionService } from '../application/transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AccessTokenGuard } from '@module/auth/guard/access-token.guard';
import { routesV1 } from '@config/app.routes';
import { GetAuthProvider } from '@module/auth/interface/decorator/member.decorator';
import { ParseBigIntPipe } from '@lib/core/pipes/parse-bigint.pipe';
import { AuthProvider } from '@module/auth/domain/entity/auth-provider.entity';

@Controller(routesV1.version)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }
  /**
   * query
   */
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get(routesV1.transaction.get.getTransactionsOfSellerAndBuyer)
  getTransactionsOfSellerAndBuyer(@GetAuthProvider() { memberId }: AuthProvider, @Query('sellerId', new ParseBigIntPipe()) sellerId: bigint, @Query('buyerId', new ParseBigIntPipe()) buyerId: bigint, @Query('page', new ParseIntPipe()) page: number, @Query('size', new ParseIntPipe()) size: number) {
    return this.transactionService.getTransactionsOfSellerAndBuyer(memberId, sellerId, buyerId, page ?? 1, size ?? 10);
  }

  // 구매자 구매 목록 조회(판매승인, 구매확정)
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get(routesV1.transaction.get.getPurchaseList)
  getPurchaseList(@GetAuthProvider() { memberId: buyerId }: AuthProvider, @Query('page', new ParseIntPipe()) page: number, @Query('size', new ParseIntPipe()) size: number) {
    return this.transactionService.getPurchaseList(buyerId, page ?? 1, size ?? 10);
  }


  // 예약 상태 거래 목록 조회
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get(routesV1.transaction.get.getReservationList)
  getReservationList(@GetAuthProvider() { memberId }: AuthProvider, @Query('page', new ParseIntPipe()) page: number, @Query('size', new ParseIntPipe()) size: number) {
    return this.transactionService.getReservationList(memberId, page ?? 1, size ?? 10);
  }

  /**
   * command
   */
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post(routesV1.transaction.post.createTransaction)
  createTransaction(@GetAuthProvider() { memberId: buyerId }: AuthProvider, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.createTransaction(buyerId, createTransactionDto);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(routesV1.transaction.patch.approveSale)
  approveSale(@GetAuthProvider() { memberId }: AuthProvider, @Param('transactionId', new ParseBigIntPipe()) transactionId: bigint) {
    return this.transactionService.approveSale(memberId, transactionId);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(routesV1.transaction.patch.confirmPurchase)
  confirmPurchase(@GetAuthProvider() { memberId: buyerId }: AuthProvider, @Param('transactionId', new ParseBigIntPipe()) transactionId: bigint) {
    return this.transactionService.confirmPurchase(buyerId, transactionId);
  }

}
