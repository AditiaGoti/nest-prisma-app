import {
    Controller,
    Get,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { AccessLocalAuthGuard } from '../../../common/guards/access.local.guard';
import { AuthService } from '../application/auth.service';
import { AccessJwtGuard } from '../../../common/guards/access.jwt.guard';
import { AccessRefreshJwtGuard } from '../../../common/guards/access.refresh-jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { UsersService } from '../../../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Req() req, @Res() res: Response) {
        const result = await this.authService.login(req.user);

        // 🔥 ACCESS TOKEN
        res.cookie('access_token', result.accessToken, {
            httpOnly: true,
            secure: false, // true kalau HTTPS
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60, // 1 jam
        });

        // 🔥 REFRESH TOKEN
        res.cookie('refresh_token', result.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return res.json({
            message: 'Login berhasil',
            user: result.user,
        });
    }
    @UseGuards(AccessJwtGuard)
    @Get('me')
    async getMe(@Req() req: any) {
        const userId = req.user.sub;

        const user = await this.usersService.findOne(userId);

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            jabatan: user.jabatan,
            isActive: user.isActive,
        };
    }

    @UseGuards(AccessRefreshJwtGuard)
    @Post('refresh')
    async refresh(@Req() req: any, @Res() res: Response) {
        const { userId, tokenId } = req.user;

        // 🔍 cek token di DB
        const token =
            await this.authService.findRefreshTokenByUserIdAndTokenId(tokenId, userId);

        if (!token || token.isRevoked) {
            throw new UnauthorizedException();
        }

        // 🔁 revoke token lama (rotation)
        await this.authService.revokeRefreshToken(tokenId);

        // 🔥 generate token baru
        const newTokens = await this.authService.generateToken(userId);

        // 🍪 set cookie baru
        res.cookie('access_token', newTokens.accessToken, {
            httpOnly: true,
            secure: false, // true kalau HTTPS
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60, // 1 jam
        });

        res.cookie('refresh_token', newTokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 hari
        });

        return res.json({
            message: 'Token refreshed',
        });
    }
    @Post('logout')
    logout(@Res() res: Response) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        return res.json({ message: 'Logout berhasil' });
    }
}
