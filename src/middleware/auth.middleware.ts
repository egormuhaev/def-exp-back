import { Request, Response, NextFunction } from "express";
import { IMiddlewares } from "../common/middlewares.interface";
import { verify } from "jsonwebtoken";

export class AuthMiddleware implements IMiddlewares {
  constructor(private secret: string) {}

  execute(req: Request, res: Response, next: NextFunction): void {
    if (req.headers.autorization) {
      const token = req.headers.autorization as string;
      verify(token.split(" ")[1], this.secret, (err: any, payload: any) => {
        if (err) {
        } else if (payload) {
          req.user = payload.email as string;
          next();
        }
      });
    }

    next();
  }
}
