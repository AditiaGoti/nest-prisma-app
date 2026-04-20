import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessRefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'access-refresh-jwt',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('accessJwt.publicKey'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return {
      sub: payload.sub,
      userId: payload.userId,
      tokenId: payload.jti, // important for rotation
    //   personnelId: payload.personnelId,
    };
  }
}
