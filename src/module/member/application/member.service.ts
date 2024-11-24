import { Inject, Injectable } from '@nestjs/common';
import { IMemberRepository } from './port/imember.repository';
import { Member } from '../domain/entity/member.entity';
import { DIToken } from '../member.di-token';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class MemberService {
  constructor(
    @Inject(DIToken.MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) { }

  async saveMember(name: string): Promise<Member> {
    try {
      const member = Member.create({ name });
      await this.memberRepository.insertMember(member);
      return member;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === 'ER_DUP_ENTRY') {
          throw new Error('이미 존재하는 이메일입니다');
        }
      }
      throw error;
    }
  }
}
