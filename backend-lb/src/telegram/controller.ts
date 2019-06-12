import { requestBody, param, post, HttpErrors } from "@loopback/rest";
import { Update } from "telegram-typings";
import { inject } from "@loopback/core";
import { ConvoMarkBot } from "./bot";

export class UpdateController {
  constructor(
    @inject('telegram.token') private botToken: string,
    @inject('telegram.bot') private bot: ConvoMarkBot
  ) {}

  @post('/bot/updates/{token}',{
    responses: {
      // '200': {
        // description: 'webhook response',
        // content:
      // }
    }
  })
  async handleUpdate(@param.path.string('token') token: string, @requestBody() update: Update) {
    if (this.botToken !== token) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }

    await this.bot.handleUpdate(update);
  }
}
