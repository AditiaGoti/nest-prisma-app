import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccessLocalAuthGuard extends AuthGuard('access-local') {}
