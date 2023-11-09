import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../common/base.controller";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { ILogger } from "../../logger/logger.interface";
import "reflect-metadata";
import { IUserController } from "./users.controller.interface";
import { IUserService } from "../service/users.service.interface";
import { UserLoginDto } from "../dto/user-login.dto";
import { UserRegisterDto } from "../dto/user-register.dto";
import { HttpError } from "../../errors/http-error.class";
import { ValidateMiddleware } from "../../middleware/validate.middleware";
import { IConfigService } from "../../config/service/config.service.interface";
import { IJwtService } from "../../jwt/jwt.service.interface";

@injectable()
export class UsersController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.JwtService) private jwtService: IJwtService
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: "/register",
        method: "post",
        func: this.register,
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
      {
        path: "/login",
        method: "post",
        func: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDto)],
      },
      {
        path: "/info",
        method: "get",
        func: this.info,
      },
    ]);
  }

  async login(
    { body }: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction
  ) {
    const validate = await this.userService.validateUser(body);
    if (!validate) {
      return next(new HttpError(401, "Ошибка авторизации", "login"));
    }

    const jwt = await this.jwtService.signJWT(
      body.email,
      this.configService.get("JWT_SECRET")
    );

    this.ok(res, { jwt });
  }

  async info(
    { user }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ) {
    this.ok(res, { email: user });
  }

  async register(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = await this.userService.createUser(body);
    if (!result) {
      return next(new HttpError(422, "Пользователь уже существует"));
    }
    this.ok(res, { email: result.email, id: result.id });
  }
}
