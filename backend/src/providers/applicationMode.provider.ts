import { Provider } from "@loopback/core";

export type ApplicationMode = 'development' | 'test' | 'production';

export class ApplicationModeProvider implements Provider<ApplicationMode> {
  value(): ApplicationMode  {
    return (process.env.NODE_ENV as ApplicationMode) || 'development'
  }
}
