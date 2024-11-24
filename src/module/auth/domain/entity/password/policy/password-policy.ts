import { IPasswordPolicy } from './password-policy.interface';

export class PasswordPolicy implements IPasswordPolicy {
  private readonly MIN_LENGTH = 8;
  private readonly PATTERN =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  validate(value: string): void {
    if (!value) {
      throw new Error('비밀번호는 필수값입니다.');
    }
    if (value.length < this.MIN_LENGTH) {
      throw new Error(
        `비밀번호는 최소 ${this.MIN_LENGTH}자 이상이어야 합니다.`,
      );
    }
    if (!this.PATTERN.test(value)) {
      throw new Error('비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.');
    }
  }
}
