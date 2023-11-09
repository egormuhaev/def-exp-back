import { ILogObj, Logger, ISettingsParam } from "tslog";

export interface ILogger {
  logger: Logger<ILogObj>;
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
}
