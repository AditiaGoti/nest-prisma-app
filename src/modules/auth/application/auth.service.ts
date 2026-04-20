import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UsersService } from '../../../users/users.service';
import { randomUUID } from 'node:crypto';
import { TokenRepository } from '../infrastructure/token.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly tokenRepository: TokenRepository,
        private readonly userService: UsersService,
    ) { }

    async login(user: Partial<User>) {
        if (!user.email) {
            throw new UnauthorizedException('User Email tidak valid');
        }

        return {
            ...user,
            ...(await this.generateToken(user.id)),
        };
    }

    async validateUser(
        email: string,
        password: string,
    ): Promise<Partial<User> | null> {

        const matchUser = await this.userService.findByEmail(email);
        if (!matchUser) return null;

        const matchPassword = await bcrypt.compare(password, matchUser.password);
        if (!matchPassword) return null;

        const { password: _, ...user } = matchUser;

        return user;
    }
    async generateToken(userId: string | undefined) {

        console.log("GENERATE TOKEN USER:", userId);

        const tokenId = randomUUID();

        const basePayload = {
            sub: userId,
        };

        console.log("SIGN ACCESS TOKEN");

        const accessToken = await this.jwtService.signAsync(basePayload, {
            expiresIn: this.configService.getOrThrow('ACCESS_TOKEN_EXPIRES') as any,
        });
        console.log("ACCESS TOKEN OK");

        const refreshPayload = {
            ...basePayload,
            jti: tokenId,
        };

        console.log("SIGN REFRESH TOKEN");

        const refreshToken = await this.jwtService.signAsync(refreshPayload, {
            expiresIn: this.configService.getOrThrow<string>('REFRESH_TOKEN_EXPIRES') as any,
        });

        console.log("REFRESH TOKEN OK");

        console.log("SAVE REFRESH TOKEN DB");

        await this.tokenRepository.createRefreshToken(
            tokenId,
            userId as string,
            refreshToken,
        );

        console.log("SAVE SUCCESS");

        return {
            accessToken,
            refreshToken,
        };
    }
    async findRefreshTokenByUserIdAndTokenId(tokenId: string, userId: string) {
        return await this.tokenRepository.getRefreshTokenByIdAndUserId(
            tokenId,
            userId,
        );
    }

    async findRefreshTokenByTokenId(tokenId: string) {
        return await this.tokenRepository.getRefreshTokenById(
            tokenId,
        );
    }

    async updateRevokeStatusByRefreshTokenId(tokenId: string, isRevoked: boolean) {
        return await this.tokenRepository.updateRefreshTokenSetRevokedByRefreshTokenId(tokenId, isRevoked);
    }

    async revokeRefreshToken(tokenId: string): Promise<void> {
        const token = await this.findRefreshTokenByTokenId(tokenId);

        if (!token) {
            throw new UnauthorizedException('Refresh token not found');
        }

        if (token.isRevoked) {
            return; // already revoked → idempotent
        }

        await this.updateRevokeStatusByRefreshTokenId(tokenId, true);
    }
}
