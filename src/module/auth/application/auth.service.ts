import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider } from '../domain/entity/auth-provider.entity';
import { AUTH_PROVIDER } from '../domain/const/auth.const';
import { Password } from '../domain/entity/password/password.entity';
import { IMemberPasswordRepository } from './port/imember-password.repository';
import { IAuthProviderRepository } from './port/iauth-provider.repository';
import authConfig from '@config/auth.config';
import { ConfigType } from '@nestjs/config';
import { DIToken } from '../auth.di-token';
import { RegisterMemberDto } from '../interface/dto/register-member.dto';
import { DuplicateProviderError } from '@module/auth/domain/error/auth.error';
import { randomUUID } from 'crypto';
import { IMemberService } from './port/imember.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(DIToken.MEMBER_SERVICE) private readonly memberService: IMemberService,
    @Inject(DIToken.MEMBER_PASSWORD_REPOSITORY) private readonly memberPasswordRepository: IMemberPasswordRepository,
    @Inject(DIToken.AUTH_PROVIDER_REPOSITORY) private readonly authProviderRepository: IAuthProviderRepository,
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) { }


  async register(signUpDto: RegisterMemberDto) {
    const { email, name, password } = signUpDto;
    const provider = await this.authProviderRepository.getAuthProviderByEmail(email);
    if (provider) {
      throw new DuplicateProviderError(email, provider.provider);
    };
    const member = await this.memberService.saveMember(name);
    const authProvider = await this.createAuthInfo(member.memberId, AUTH_PROVIDER.EMAIL, randomUUID(), email, password);
    return this.generateTokens(authProvider);
  }

  async authenticate(email: string, passwordString: string): Promise<{ accessToken: string; refreshToken: string }> {
    const authProvider = await this.authProviderRepository.getAuthProviderByEmail(email);
    if (!authProvider) {
      throw new Error('회원이 아닙니다.');
    }
    return await this.authenticateByPassword(authProvider.memberId, passwordString);
  }

  async socialAuthenticate(email: string, name: string, provider: (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER], providerId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const authProvider = await this.getAuthProvider(provider, providerId);

    if (authProvider) {
      return this.generateTokens(authProvider);
    } else {
      const member = await this.memberService.saveMember(name);
      const authProvider = await this.createAuthInfo(member.memberId, provider, providerId, email);
      return this.generateTokens(authProvider);
    }
  }

  async createAuthInfo(memberId: bigint, provider: (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER], providerId: string, email: string, password?: string) {
    const memberProvider = AuthProvider.create({
      memberId,
      providerId,
      provider,
      email,
    });
    await this.authProviderRepository.insertAuthProvider(memberProvider);
    if (password) {
      await this.memberPasswordRepository.insertPassword(Password.create({
        password,
        memberId,
      }));
    }
    return memberProvider;
  }

  async getAuthProviderByMemberId(memberId: bigint) {
    const provider = await this.authProviderRepository.getAuthProviderByMemberId(memberId);
    if (!provider) {
      throw new Error('인증 정보가 존재하지 않습니다.');
    }
    return provider;
  }

  async getAuthProvider(provider: (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER], providerId: string) {
    const authProvider = await this.authProviderRepository.getAuthProvider(provider, providerId);
    if (!authProvider) {
      throw new Error('인증 정보가 존재하지 않습니다.');
    }
    return authProvider;
  }

  async getPasswordByMemberId(memberId: bigint) {
    const password = await this.memberPasswordRepository.getPasswordByMemberId(memberId);
    if (!password) {
      throw new Error('비밀번호가 존재하지 않습니다.');
    }
    return password;
  }

  async authenticateByPassword(memberId: bigint, password: string) {
    const passwordEntity = await this.getPasswordByMemberId(memberId);
    if (!passwordEntity.equals(password)) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    const authProvider = await this.getAuthProviderByMemberId(memberId);
    if (authProvider.provider !== AUTH_PROVIDER.EMAIL) {
      throw new Error('이메일 로그인만 지원합니다.');
    }
    return this.generateTokens(authProvider);
  }

  async generateAccessToken(provider: AuthProvider): Promise<string> {
    return this.jwtService.signAsync({
      type: 'access',
      provider: provider.provider,
    }, {
      expiresIn: this.config.jwtAccessExpiresIn,
      issuer: this.config.jwtIssure,
      subject: provider.providerId,
      audience: this.config.jwtAudience,
      secret: this.config.jwtAccessSecret,
    });
  }

  async generateRefreshToken(provider: AuthProvider): Promise<string> {
    return this.jwtService.signAsync({
      type: 'refresh',
    }, {
      expiresIn: this.config.jwtRefreshExpiresIn,
      issuer: this.config.jwtIssure,
      subject: provider.providerId,
      audience: this.config.jwtAudience,
      secret: this.config.jwtRefreshSecret,
    });
  }

  async generateTokens(provider: AuthProvider) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(provider),
      this.generateRefreshToken(provider),
    ]);

    return { accessToken, refreshToken };
  }

}