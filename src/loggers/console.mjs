import loggers from "./index.mjs";

const { LEVELS: logLevel } = loggers;

const LoggerConsole =
  () =>
  ({ namespace, level, label, log }) => {
    const prefix = namespace ? `[${namespace}] ` : "";
    const message = JSON.stringify(
      Object.assign({ level: label }, log, {
        message: `${prefix}${log.message}`,
      }),
    );

    switch (level) {
      case logLevel.INFO:
        return console.info(message);
      case logLevel.ERROR:
        return console.error(message);
      case logLevel.WARN:
        return console.warn(message);
      case logLevel.DEBUG:
        return console.log(message);
    }
  };

export default LoggerConsole;
