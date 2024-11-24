import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: '제품 ID',
    example: '1234567890',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  productId: bigint;

  @ApiProperty({
    description: '구매 가격',
    example: 10000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  purchasePrice: number;
}
