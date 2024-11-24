export interface RefreshTokenPayload {
  type: 'refresh';
  sub: number;        // 사용자 ID
  iat: number;        // 토큰 발급 시간
  exp: number;        // 토큰 만료 시간
  aud: string;        // 토큰 대상자 (audience)
  iss: string;        // 토큰 발급자 (issuer)
}
