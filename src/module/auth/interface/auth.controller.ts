import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { routesV1 } from '@config/app.routes';
import { Response } from 'express';
import { AccessTokenGuard } from '../guard/access-token.guard';
import { RegisterMemberDto } from './dto/register-member.dto';
import { EmailLogInGuard } from '../guard/email.guard';
import { KakaoLogInGuard } from '../guard/kakao.guard';
import { NaverLogInGuard } from '../guard/naver.guard';
import { GetToken } from './decorator/get-token.decorator';

@Controller(routesV1.version)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post(routesV1.auth.post.register)
  async register(@Body() registerMemberDto: RegisterMemberDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.register(registerMemberDto);
    this.setTokenHeader(res, accessToken, refreshToken);
    res.status(204).end();
  }

  @UseGuards(EmailLogInGuard)
  @Post(routesV1.auth.post.emailLogIn)
  async emailLogIn(@GetToken() token: { accessToken: string; refreshToken: string }, @Res() res: Response) {
    this.setTokenHeader(res, token.accessToken, token.refreshToken);
    res.status(204).end();
  }

  @UseGuards(KakaoLogInGuard)
  @Post(routesV1.auth.post.kakaoLogin)
  async kakaoLogin(@GetToken() token: { accessToken: string; refreshToken: string }, @Res() res: Response) {
    this.setTokenHeader(res, token.accessToken, token.refreshToken);
    res.status(204).end();
  }

  @UseGuards(NaverLogInGuard)
  @Post(routesV1.auth.post.naverLogin)
  async naverLogin(@GetToken() token: { accessToken: string; refreshToken: string }, @Res() res: Response) {
    this.setTokenHeader(res, token.accessToken, token.refreshToken);
    res.status(204).end();
  }

  @UseGuards(AccessTokenGuard)
  @Post(routesV1.auth.post.logOut)
  async logOut(@Res() res: Response) {
    // 서버에서는 토큰 관련 처리할 필요 없음 - 클라이언트에서 처리해야 함
    // 리프레시 토큰 제거 
    res.clearCookie('refreshToken', {
      httpOnly: true,
      path: '/',
      sameSite: 'strict'
    });

    res.cookie('Refresh', null, { expires: new Date(0) });
    res.status(204).end();
  }


  private setTokenHeader(res: Response, accessToken: string, refreshToken: string) {
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Path=/; SameSite=Strict`);
    res.setHeader('Authorization', `Bearer ${accessToken}`);
  }
}
