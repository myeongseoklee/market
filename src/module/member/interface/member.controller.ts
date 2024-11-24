import { Controller } from '@nestjs/common';
import { routesV1 } from '@config/app.routes';
import { MemberService } from '@module/member/application/member.service';


@Controller(routesV1.version)
export class MemberController {
  constructor(private readonly memberService: MemberService) { }
}
