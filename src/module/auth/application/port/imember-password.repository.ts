import { Password } from '@module/auth/domain/entity/password/password.entity';
import { InsertResult } from 'typeorm';

export interface IMemberPasswordRepository {
  /**
   * query
   */
  getPasswordByMemberId(memberId: bigint): Promise<Password | null>;
  /**
   * command
   */
  insertPassword(password: Password): Promise<InsertResult>;
}
