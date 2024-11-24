import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto {
  @ApiProperty({
    description: '판매자 ID',
    example: '1234567890',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  sellerId: bigint;

  @ApiProperty({
    description: '제품 이름',
    example: '제품 이름',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: '제품 가격',
    example: 10000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: '제품 수량',
    example: 10,
    required: true,
    default: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
