const MEMBER_PASSWORD_REPOSITORY = Symbol('MemberPasswordRepository');
const AUTH_PROVIDER_REPOSITORY = Symbol('AuthProviderRepository');
const MEMBER_SERVICE = Symbol('MemberService');

export const DIToken = {
  MEMBER_PASSWORD_REPOSITORY,
  AUTH_PROVIDER_REPOSITORY,
  MEMBER_SERVICE,
} as const;
