export const TYPES = {
  Application: Symbol.for("Application"),
  ILogger: Symbol.for("ILogger"),

  UserController: Symbol.for("IUserController"),
  UserService: Symbol.for("IUserService"),
  UserRepository: Symbol.for("IUserRepository"),

  JwtService: Symbol.for("IJwtService"),
  ExeptionFilter: Symbol.for("IExeptionFilter"),
  ConfigService: Symbol.for("IConfigService"),
  PrismaService: Symbol.for("PrismaService"),
};
