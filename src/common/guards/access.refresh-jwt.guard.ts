// auth/guards/refresh-jwt.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessRefreshJwtGuard extends AuthGuard('access-refresh-jwt') {}
