import { ErrorBase } from '@lib/core/base/error.base';

// TODO: 에러 클래스에 따른 Exception Handler 구현 및 error code enum 관리
export class DuplicateProviderError extends ErrorBase {
  constructor(email: string, existingProvider: string) {
    super(`이미 ${existingProvider} 계정으로 가입된 이메일입니다`, 'DuplicateProviderError');
    this.name = 'DuplicateProviderError';
  }

} 