import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {AuthenticationSequence} from './sequence';
import {TelegramComponent} from './telegram';
import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {UserService} from './services';
import {
  TokenStrategy,
  JWTService,
  TokenServiceBindings,
  TokenServiceConstants,
  UserServiceBindings,
} from './authentication';
import {ApplicationModeProvider} from './providers';
import {LoggingComponent, logger, Loggable, Logger} from './logging';
import {GraphQLComponent} from './graphql';
import {SentryDSNProvider, SentryEnvProvider} from './providers';
import {SentryBooter} from './booters';
import {ConvoMarkBindings, SentryBindings} from './keys';
import {TypeORMBooter} from './typeorm';

@logger()
export class ConvoMarkApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) implements Loggable {
  logger: Logger;
  
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Register bindings
    this.setUpBindings();

    // Set up the custom sequence
    this.sequence(AuthenticationSequence);

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Set up logging
    this.component(LoggingComponent);

    // Set up Bot
    this.component(TelegramComponent);

    // Set up GraphQL
    this.component(GraphQLComponent);

    // Set up authentication
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, TokenStrategy);

    // Set up custom Booters
    this.booters(SentryBooter, TypeORMBooter);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setUpBindings() {
    // Mode setting
    this.bind(ConvoMarkBindings.APPLICATION_MODE).toProvider(
      ApplicationModeProvider,
    );

    this.bind(SentryBindings.SENTRY_DSN).toProvider(SentryDSNProvider);
    this.bind(SentryBindings.SENTRY_ENV).toProvider(SentryEnvProvider);

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.ACCESS_TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.ACCESS_TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.REFRESH_TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.REFRESH_TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_AUDIENCE).to(
      TokenServiceConstants.TOKEN_AUDIENCE_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_ISSUER).to(
      TokenServiceConstants.TOKEN_ISSUER_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(UserService);
  }
}
