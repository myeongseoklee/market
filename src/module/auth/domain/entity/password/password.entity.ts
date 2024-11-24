import { PasswordHasher } from './hasher/password-hasher';
import { PasswordPolicy } from './policy/password-policy';
import { IPasswordHasher } from './hasher/password-hasher.interface';
import { IPasswordPolicy } from './policy/password-policy.interface';
import { EntityBase } from '@lib/core/base/entity.base';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BigIntTransformer } from '@lib/common/transformers/bigint.transformer';

interface CreatePasswordProps {
  password: string;
  memberId: bigint;
  createdAt?: Date;
  updatedAt?: Date;
}

@Entity('auth_passwords')
export class Password extends EntityBase {
  @PrimaryColumn({
    name: 'member_id',
    type: 'bigint',
    comment: '회원 ID',
    transformer: new BigIntTransformer(),
  })
  memberId: bigint;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    comment: '비밀번호',
  })
  password: string;

  private readonly hasher: IPasswordHasher = new PasswordHasher();
  private readonly policy: IPasswordPolicy = new PasswordPolicy();

  static create(
    props: CreatePasswordProps,
  ): Password {
    new PasswordPolicy().validate(props.password);
    const hashedPassword = new PasswordHasher().hash(props.password);
    const password = new Password();
    const now = new Date();
    password.password = hashedPassword;
    password.memberId = props.memberId;
    password.createdAt = props?.createdAt ?? now;
    password.updatedAt = props?.updatedAt ?? now;
    return password;
  }

  static createFromHashed(hashedPassword: string, memberId: bigint): Password {
    const password = new Password();
    const now = new Date();
    password.password = hashedPassword;
    password.memberId = memberId;
    password.createdAt = now;
    password.updatedAt = now;
    return password;
  }

  equals(plainPassword: string): boolean {
    this.policy.validate(plainPassword);
    return this.hasher.compare(plainPassword, this.password);
  }

  toString(): string {
    return this.password;
  }
}
