import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import { AuthenticationSequence } from './sequence';
import { TelegramComponent } from './telegram';
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import {  } from './authentication/keys';
import { UserService } from './services/user.service';
import {
  TokenStrategy,
  JWTService,
  TokenServiceBindings,
  TokenServiceConstants,
  UserServiceBindings
} from './authentication';

export class ConvomarkApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Register bindings
    this.setUpBindings();

    // Mode setting
    this.bind('application.mode').to(process.env.NODE_ENV || 'development');

    // Set up the custom sequence
    this.sequence(AuthenticationSequence);

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Set up Bot
    this.component(TelegramComponent);

    // Set up authentication
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, TokenStrategy);

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

  setUpBindings(): void {
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
