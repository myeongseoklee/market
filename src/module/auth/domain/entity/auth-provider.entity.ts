import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { EntityBase } from '@lib/core/base/entity.base';
import { BigIntTransformer } from '@lib/common/transformers/bigint.transformer';
import { AUTH_PROVIDER } from '@module/auth/domain/const/auth.const';

interface CreateAuthProviderProps {
  memberId: bigint;
  providerId: string;
  provider: (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Entity('auth_providers')
export class AuthProvider extends EntityBase {

  @PrimaryColumn({
    name: 'member_id',
    type: 'bigint',
    comment: '회원 ID',
    transformer: new BigIntTransformer(),
  })
  memberId: bigint;

  @Column({
    name: 'provider_id',
    type: 'char',
    length: 36,
    nullable: true,
    comment: '로그인 제공자 아이디',
  })
  providerId: string;

  @Column({
    name: 'provider',
    type: 'enum',
    enum: AUTH_PROVIDER,
    nullable: false,
    comment: '로그인 제공자',
  })
  provider: (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '로그인 이메일',
  })
  email: string;

  static create(props: CreateAuthProviderProps): AuthProvider {
    const authProvider = new AuthProvider();
    const now = new Date();
    authProvider.memberId = props.memberId;
    authProvider.providerId = props.providerId;
    authProvider.provider = props.provider;
    authProvider.email = props.email;
    authProvider.createdAt = props?.createdAt ?? now;
    authProvider.updatedAt = props?.updatedAt ?? now;
    return authProvider;
  }
}
