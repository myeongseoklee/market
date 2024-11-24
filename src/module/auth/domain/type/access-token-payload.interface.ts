import { AUTH_PROVIDER } from "../const/auth.const";

export interface AccessTokenPayload {
  type: 'access';
  provider: (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];
  sub: string;        // 사용자 PROVIDER ID
  iat: number;        // 토큰 발급 시간
  exp: number;        // 토큰 만료 시간
  aud: string;        // 토큰 대상자 (audience)
  iss: string;        // 토큰 발급자 (issuer)
}
