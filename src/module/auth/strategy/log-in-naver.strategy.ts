import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { AUTH_PROVIDER } from '../../auth/domain/const/auth.const';
import { AuthService } from '@module/auth/application/auth.service';

@Injectable()
export class NaverLogInStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<{ accessToken: string; refreshToken: string }> {
    const email = profile._json?.email;
    return await this.authService.socialAuthenticate(email, profile.displayName, AUTH_PROVIDER.NAVER, profile.id);
  }
}
