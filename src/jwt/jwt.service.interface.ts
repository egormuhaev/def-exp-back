export interface IJwtService {
  signJWT: (email: string, secret: string) => Promise<string>;
}
