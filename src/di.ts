import { ContainerModule, interfaces } from "inversify";
import { TYPES } from "./types";
import App from "./app";
import { IUserService } from "./users/service/users.service.interface";
import { UserService } from "./users/service/users.service";
import { IConfigService } from "./config/service/config.service.interface";
import { ConfigService } from "./config/service/config.service";
import { PrismaService } from "./database/service/prisma.service";
import { IUsersRepository } from "./users/repository/users.repository.interface";
import { UsersRepository } from "./users/repository/users.repository";
import { ExeptionFilter } from "./errors/exeption.filter";
import { LoggerService } from "./logger/logger.service";
import { UsersController } from "./users/controller/users.controller";
import { IUserController } from "./users/controller/users.controller.interface";
import { ILogger } from "./logger/logger.interface";
import { IExeptionFilter } from "./errors/exeprion.filter.interface";
import { IJwtService } from "./jwt/jwt.service.interface";
import { JwtService } from "./jwt/jwt.service";

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<IJwtService>(TYPES.JwtService).to(JwtService).inSingletonScope();
  bind<IUsersRepository>(TYPES.UserRepository)
    .to(UsersRepository)
    .inSingletonScope(),
    bind<PrismaService>(TYPES.PrismaService)
      .to(PrismaService)
      .inSingletonScope();
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
  bind<IExeptionFilter>(TYPES.ExeptionFilter)
    .to(ExeptionFilter)
    .inSingletonScope();
  bind<IUserController>(TYPES.UserController)
    .to(UsersController)
    .inSingletonScope();
  bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
  bind<IConfigService>(TYPES.ConfigService)
    .to(ConfigService)
    .inSingletonScope();
  bind<App>(TYPES.Application).to(App).inSingletonScope();
});
