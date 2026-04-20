export interface IAccessJwtConfig {
  privateKey: string;
  publicKey: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}
