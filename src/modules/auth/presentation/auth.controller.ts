import {
    Controller,
    Get,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { AccessLocalAuthGuard } from '../../../common/guards/access.local.guard';
import { AuthService } from '../application/auth.service';
import { AccessJwtGuard } from '../../../common/guards/access.jwt.guard';
import { AccessRefreshJwtGuard } from '../../../common/guards/access.refresh-jwt.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Req() req: any) {
        console.log('REQ USER:', req.user);
        return this.authService.login(req.user);
    }
    @UseGuards(AccessJwtGuard)
    @Get('me')
    getMe(@Req() req: any) {
        return req.user;
    }

    @UseGuards(AccessRefreshJwtGuard)
    @Post('refresh')
    async refresh(@Req() req: any) {
        const { userId, tokenId } = req.user;

        // check token in DB
        const token =
            await this.authService.findRefreshTokenByUserIdAndTokenId(tokenId, userId);

        if (!token || token.isRevoked) {
            throw new UnauthorizedException();
        }

        // rotate
        await this.authService.revokeRefreshToken(tokenId);

        return this.authService.generateToken(userId);
    }
}
