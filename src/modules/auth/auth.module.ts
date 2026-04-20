import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AccessLocalStrategy } from '../../common/strategies/access.local.strategy';
import { AccessJwtStrategy } from '../../common/strategies/acess.jwt.strategy';
import { TokenRepository } from './infrastructure/token.repository';
import { AccessRefreshJwtStrategy } from '../../common/strategies/acess.refresh-jwt.strategy';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: '1h',
                },
            }),
        }),
        UsersModule
    ],
    providers: [AuthService, TokenRepository, AccessLocalStrategy, AccessJwtStrategy],
    controllers: [AuthController],
})
export class AuthModule { }
