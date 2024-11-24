import { IAuthProviderRepository } from '@module/auth/application/port/iauth-provider.repository';
import { AuthProvider } from '@module/auth/domain/entity/auth-provider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, DataSource } from 'typeorm';
import { RepositoryBase } from '@lib/core/base/repository.base';
import { AUTH_PROVIDER } from '@module/auth/domain/const/auth.const';

export class AuthProviderRepository
  extends RepositoryBase<AuthProvider>
  implements IAuthProviderRepository {
  constructor(
    @InjectRepository(AuthProvider)
    private readonly authProviderRepository: Repository<AuthProvider>,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }
  /**
   * query
   */
  async getAuthProviderByMemberId(memberId: bigint): Promise<AuthProvider | null> {
    return await this.authProviderRepository.findOneBy({ memberId });
  }
  async getAuthProvider(provider: (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER], providerId: string): Promise<AuthProvider | null> {
    return await this.authProviderRepository.findOneBy({ provider, providerId });
  }
  async getAuthProviderByEmail(email: string): Promise<AuthProvider | null> {
    return await this.authProviderRepository.findOneBy({ email });
  }
  /**
   * command
   */
  async insertAuthProvider(authProvider: AuthProvider): Promise<InsertResult> {
    return await this.authProviderRepository.insert(authProvider);
  }


}
