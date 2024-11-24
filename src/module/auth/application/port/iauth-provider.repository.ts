import { AUTH_PROVIDER } from '@module/auth/domain/const/auth.const';
import { AuthProvider } from '@module/auth/domain/entity/auth-provider.entity';
import { InsertResult } from 'typeorm';

export interface IAuthProviderRepository {
  /**
   * query
   */
  getAuthProviderByMemberId(memberId: bigint): Promise<AuthProvider | null>;
  getAuthProvider(provider: (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER], providerId: string): Promise<AuthProvider | null>;
  getAuthProviderByEmail(email: string): Promise<AuthProvider | null>;
  /**
   * command
   */
  insertAuthProvider(authProvider: AuthProvider): Promise<InsertResult>;
}
