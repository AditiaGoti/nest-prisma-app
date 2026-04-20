import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';


@Injectable()
export class TokenRepository {
    constructor(private prisma: PrismaService) { }

    async createRefreshToken(
        tokenId: string,
        userId: string,
        hashedToken: string,
    ) {
        return this.prisma.refreshToken.create({
            data: {
                id: tokenId,
                userId,
                hashedToken,
                isRevoked: false,
                createdBy: userId,
                updatedBy: userId,
            },
        });
    }

    async getRefreshTokenByIdAndUserId(id: string, userId: string) {
        return this.prisma.refreshToken.findFirst({
            where: {
                id,
                userId,
            },
        });
    }

    async getRefreshTokenById(id: string) {
        return this.prisma.refreshToken.findFirst({
            where: {
                id,
            },
        });
    }

    async updateRefreshTokenSetRevokedByRefreshTokenId(
        id: string,
        isRevoked: boolean,
    ) {
        return this.prisma.refreshToken.update({
            where: { id },
            data: {
                isRevoked,
            },
        });
    }
}
