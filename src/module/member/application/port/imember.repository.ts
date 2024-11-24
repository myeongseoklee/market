import { IRepository } from '@lib/core/base/repository.interface';
import { Member } from '@module/member/domain/entity/member.entity';
import { InsertResult } from 'typeorm';

export interface IMemberRepository extends IRepository<Member> {
  /**
   * command
   */
  insertMember(member: Member): Promise<InsertResult>;
}
