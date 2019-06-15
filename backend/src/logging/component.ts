import { Component } from "@loopback/core";
import { LoggingBindings } from "./keys";
import { LoggerProvider, LogLevelProvider } from "./providers";

export class LoggingComponent implements Component {
  providers = {
    [LoggingBindings.LOGGER.key]: LoggerProvider,
    [LoggingBindings.LOG_LEVEL.key]: LogLevelProvider,
  }
}
