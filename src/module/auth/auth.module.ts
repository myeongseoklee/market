import { Module } from '@nestjs/common';
import { MemberModule } from '@module/member/member.module';
import { AuthService } from './application/auth.service';
import { AuthController } from './interface/auth.controller';
import { DIToken } from './auth.di-token';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MemberPasswordRepository } from './infra/db/member-password.repository';
import { AuthProviderRepository } from './infra/db/auth-provider.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthProvider } from './domain/entity/auth-provider.entity';
import { Password } from './domain/entity/password/password.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import authConfig from '@config/auth.config';
import { ConfigType } from '@nestjs/config';
import { AccessTokenStrategy } from './strategy/access-token.strategy';
import { AccessTokenGuard } from './guard/access-token.guard';
import { MemberService } from '@module/member/application/member.service';
import { EmailLogInGuard } from './guard/email.guard';
import { EmailLogInStrategy } from './strategy/log-in-email.strategy';

const controllers = [AuthController];
const services = [
    AuthService,
    {
        provide: DIToken.MEMBER_SERVICE,
        useExisting: MemberService,
    }
];
const repositories = [
    { provide: DIToken.MEMBER_PASSWORD_REPOSITORY, useClass: MemberPasswordRepository },
    { provide: DIToken.AUTH_PROVIDER_REPOSITORY, useClass: AuthProviderRepository },
];
const guards = [
    EmailLogInGuard,
    AccessTokenGuard,
];
const strategies = [
    EmailLogInStrategy,
    AccessTokenStrategy,
];

@Module({
    imports: [
        TypeOrmModule.forFeature([Password, AuthProvider]),
        MemberModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigType<typeof authConfig>) => {
                return {
                    secret: 'temp-key',
                } as JwtModuleOptions
            },
            inject: [authConfig.KEY],
        }),
    ],
    controllers: [...controllers],
    providers: [...services, ...repositories, ...guards, ...strategies],
    exports: [...services],
})
export class AuthModule { }
