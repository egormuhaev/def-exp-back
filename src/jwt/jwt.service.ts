import { sign } from "jsonwebtoken";
import { IJwtService } from "./jwt.service.interface";
import { injectable } from "inversify";

@injectable()
export class JwtService implements IJwtService {
  public signJWT(email: string, secret: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      sign(
        { email, iat: Math.floor(Date.now() / 1000) },
        secret,
        {
          algorithm: "HS256",
        },
        (err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token as string);
        }
      );
    });
  }
}
