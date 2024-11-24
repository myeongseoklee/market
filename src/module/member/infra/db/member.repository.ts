import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RepositoryBase } from '@lib/core/base/repository.base';
import { Member } from '../../domain/entity/member.entity';
import { IMemberRepository } from '../../application/port/imember.repository';

@Injectable()
export class MemberRepository
  extends RepositoryBase<Member>
  implements IMemberRepository {
  constructor(
    @InjectRepository(Member)
    private readonly repository: Repository<Member>,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }
  /**
   * command
   */
  async insertMember(member: Member) {
    return await this.repository.insert(member);
  }
}
