import { Member } from "@module/member/domain/entity/member.entity";

export interface IMemberService {
  saveMember(name: string): Promise<Member>;
}
