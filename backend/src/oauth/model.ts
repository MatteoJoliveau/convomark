import {
    RefreshTokenModel,
    Client,
    User as OAuthUser,
    Token,
    RefreshToken,
    Falsey,
    ClientCredentialsModel,
    ExtensionModel
} from "oauth2-server";

export class Model implements RefreshTokenModel, ClientCredentialsModel, ExtensionModel {
    async generateAccessToken(client: Client, user: OAuthUser, scope: string | string[]): Promise<string> {
        return ''
    }

    async generateRefreshToken(client: Client, user: OAuthUser, scope: string | string[]): Promise<string> {
        return ''
    }

    async getAccessToken(accessToken: string): Promise<Token | Falsey> {
        return false
    }

    async getClient(clientId: string, clientSecret: string): Promise<Client | Falsey> {
        return false
    }

    async getRefreshToken(refreshToken: string): Promise<RefreshToken | Falsey> {
        return false
    }

    async revokeToken(token: RefreshToken | Token): Promise<boolean> {
        return false
    }

    async saveToken(token: Token, client: Client, user: OAuthUser): Promise<Token | Falsey> {
        return false
    }

    async verifyScope(token: Token, scope: string | string[]): Promise<boolean> {
        return false
    }

    async getUserFromClient(client: Client): Promise<OAuthUser | Falsey> {
        return false
    }

    async validateScope(user: OAuthUser, client: Client, scope: string | string[]): Promise<string | string[] | Falsey> {
        return false
    }

}