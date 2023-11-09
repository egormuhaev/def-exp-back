import express, { Express } from "express";
import { Server } from "node:http";
import { inject, injectable } from "inversify";
import { ILogger } from "./logger/logger.interface";
import { TYPES } from "./types";
import { IExeptionFilter } from "./errors/exeprion.filter.interface";
import { json } from "body-parser";
import "reflect-metadata";
import { UsersController } from "./users/controller/users.controller";
import { PrismaService } from "./database/service/prisma.service";
import { IConfigService } from "./config/service/config.service.interface";
import { AuthMiddleware } from "./middleware/auth.middleware";
 
@injectable()
class App {
  private app: Express;
  private server: Server;
  private port: number;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.UserController) private usersController: UsersController,
    @inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
    @inject(TYPES.PrismaService) private prismaService: PrismaService,
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {
    this.app = express();
    this.port = 8000;
  }

  useRoutes() {
    this.app.use("/users", this.usersController.router);
  }

  useMiddleware() {
    this.app.use(json());
    const authMiddleware = new AuthMiddleware(
      this.configService.get("SECRET_JWT")
    );
    this.app.use(authMiddleware.execute.bind(authMiddleware))
  }

  useExeptionFilters() {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  public async init() {
    this.useMiddleware();
    this.useRoutes();
    this.useExeptionFilters();
    await this.prismaService.connect();
    this.server = this.app.listen(this.port, () => {
      this.logger.log(`Server start on port: ${this.port} 123`);
    });
  }
}

export default App;
