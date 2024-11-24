import { Module } from '@nestjs/common';
import { MemberService } from './application/member.service';
import { MemberController } from './interface/member.controller';
import { MemberRepository } from './infra/db/member.repository';
import { Member } from './domain/entity/member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DIToken } from './member.di-token';
import { AuthModule } from '@module/auth/auth.module';

const controllers = [MemberController];
const services = [MemberService];
const repositories = [
  { provide: DIToken.MEMBER_REPOSITORY, useClass: MemberRepository },
];

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [...controllers],
  providers: [...services, ...repositories],
  exports: [...services],
})
export class MemberModule { }
