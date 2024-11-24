import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '@module/auth/application/auth.service';

@Injectable()
export class EmailLogInStrategy extends PassportStrategy(Strategy, 'email') {
  constructor(
    private readonly authService: AuthService
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.authenticate(email, password);
  }
}