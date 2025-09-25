export interface Logger {
  debug(msg: string, ...args: unknown[]): void;
  log(msg: string, ...args: unknown[]): void;
  warn(msg: string, ...args: unknown[]): void;
  error(msg: string | Error, ...args: unknown[]): void;
  fatal(msg: string | Error, ...args: unknown[]): void;
  setContext(context: string): void;
}
