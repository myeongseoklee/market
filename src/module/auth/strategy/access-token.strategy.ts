import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import authConfig from '@config/auth.config';
import { Inject } from '@nestjs/common';
import { AccessTokenPayload } from '../domain/type';
import { AuthService } from '../application/auth.service';

export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access-token') {
  constructor(
    private readonly authService: AuthService,
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtAccessSecret,
      issuer: config.jwtIssure,
      audience: config.jwtAudience,
    });
  }

  async validate(payload: AccessTokenPayload) {
    const authProvider = await this.authService.getAuthProvider(payload.provider, payload.sub);
    return {
      memberId: authProvider.memberId,
    };
  }
}
