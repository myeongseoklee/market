import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('access-token') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // 에러가 있어도 통과시키고, 유저가 없어도 통과시킵니다 (optional)
    if (err) {
      return null;
    }
    return user;
  }
}
