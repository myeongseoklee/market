import { AUTH_PROVIDER } from '@module/auth/domain/const/auth.const';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class LogInDto {
  @ApiProperty({
    description: '로그인 제공자',
    example: 'email',
    required: true,
    enum: AUTH_PROVIDER,
  })
  @IsNotEmpty()
  @IsEnum(AUTH_PROVIDER)
  provider: (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];

  @ApiProperty({
    description: '로그인 이메일',
    example: 'test@example.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
    required: false,
    default: null,
  })
  name: string | null;
}
