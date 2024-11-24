import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { EntityBase } from '@lib/core/base/entity.base';
import { BigIntTransformer } from '@lib/common/transformers/bigint.transformer';
import { AuthProvider } from '@module/auth/domain/entity/auth-provider.entity';

interface CreateMemberProps {
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Entity('members')
export class Member extends EntityBase {
  @PrimaryColumn({
    name: 'member_id',
    type: 'bigint',
    generated: 'increment',
    comment: '회원 ID',
    transformer: new BigIntTransformer(),
  })
  memberId: bigint;

  @OneToOne(() => AuthProvider, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'member_id', referencedColumnName: 'memberId' })
  provider: AuthProvider;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '회원명',
  })
  name: string;

  static create(props: CreateMemberProps): Member {
    const member = new Member();
    const now = new Date();
    member.name = props.name;
    member.createdAt = props?.createdAt ?? now;
    member.updatedAt = props?.updatedAt ?? now;
    return member;
  }

  setMemberId(memberId: bigint) {
    if (this.memberId) {
      // console.log('this.memberId', this.memberId)
      throw new Error('memberId는 변경할 수 없습니다.');
    }
    this.memberId = memberId;
  }
}
