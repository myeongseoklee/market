import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AUTH_PROVIDER } from '../../auth/domain/const/auth.const';
import { AuthService } from '@module/auth/application/auth.service';

@Injectable()
export class KakaoLogInStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<{ accessToken: string; refreshToken: string }> {
    const email = profile._json?.kakao_account?.email;
    return await this.authService.socialAuthenticate(email, profile.displayName, AUTH_PROVIDER.KAKAO, profile.id);
  }
}
