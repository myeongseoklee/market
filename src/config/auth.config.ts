import { registerAs } from '@nestjs/config';

/**
 * auth이라는 토큰으로 ConfigFactory를 등록할 수 있는 함수
 * @param jwtIssure jwt 토큰의 발급자입니다
 * @param jwtAudience jwt 토큰의 수신자입니다
 * @param jwtAccessSecret jwt 엑세스 토큰의 secret key입니다
 * @param jwtAccessExpiresIn jwt 엑세스 토큰의 만료 기간(수명)입니다
 * @param jwtRefreshSecret jwt 리프레쉬 토큰의 secret key입니다
 * @param jwtRefreshExpiresIn jwt 리프레쉬 토큰의 만료 기간(수명)입니다
 */
export default registerAs('auth', () => ({
  jwtIssure: process.env.JWT_ISSURE,
  jwtAudience: process.env.JWT_AUDIENCE,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET_KEY,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET_KEY,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
}));
