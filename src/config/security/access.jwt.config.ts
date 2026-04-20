import { registerAs } from '@nestjs/config';
import * as fs from 'fs';
import { IAccessJwtConfig } from '../../common/interface/security/security.inteface';

export default registerAs('accessJwt', () : IAccessJwtConfig => ({
  privateKey: fs.readFileSync('keys/apps.private.pkcs8.key', 'utf8'),
  publicKey: fs.readFileSync('keys/apps.public.key', 'utf8'),
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d'
}));
