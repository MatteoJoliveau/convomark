import {inject, Provider} from "@loopback/context";
import * as OAuth2Server from "oauth2-server";
import {RestBindings} from "@loopback/rest";
import {Request, Response} from "express";

export class ServerProvider implements Provider<OAuth2Server> {
    constructor(
        @inject(RestBindings.Http.REQUEST) private request: Request,
        @inject(RestBindings.Http.RESPONSE) private response: Response,
    ) {}

    value(): OAuth2Server {
        return new OAuth2Server.OAuth2Server({});
    }

}