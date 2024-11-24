import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, InsertResult } from 'typeorm';
import { RepositoryBase } from '@lib/core/base/repository.base';
import { IMemberPasswordRepository } from '@module/auth/application/port/imember-password.repository';
import { Password } from '@module/auth/domain/entity/password/password.entity';

export class MemberPasswordRepository
  extends RepositoryBase<Password>
  implements IMemberPasswordRepository {
  constructor(
    @InjectRepository(Password)
    private readonly repository: Repository<Password>,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }
  /**
   * query
   */
  async getPasswordByMemberId(memberId: bigint): Promise<Password | null> {
    return await this.repository.findOneBy({ memberId });
  }

  /**
   * command
   */
  async insertPassword(password: Password): Promise<InsertResult> {
    return await this.repository.insert(password);
  }
}
