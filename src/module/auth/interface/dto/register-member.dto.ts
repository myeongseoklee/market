import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterMemberDto {
  @ApiProperty({
    description: '사용자 이메일 주소',
    example: 'test@example.com',
    required: true,
    maxLength: 255,
  })
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요' })
  @IsNotEmpty({ message: '이메일은 필수 입력값입니다' })
  @MaxLength(255, { message: '이메일은 255자를 초과할 수 없습니다' })
  email: string;

  @ApiProperty({
    description: '사용자 비밀번호(최소 8자, 영문/숫자/특수문자 조합)',
    example: 'Password123!',
    required: false,
    minLength: 8,
    maxLength: 255,
    default: null,
  })
  @IsString({ message: '비밀번호는 문자열이어야 합니다' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })
  @MaxLength(255, { message: '비밀번호는 255자를 초과할 수 없습니다' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다',
  })
  password: string;

  @ApiProperty({
    description: '사용자 실명',
    example: '홍길동',
    required: false,
    maxLength: 50,
    default: null,
  })
  @IsString({ message: '이름은 문자열이어야 합니다' })
  @MaxLength(50, { message: '이름은 50자를 초과할 수 없습니다' })
  name: string;
}
