/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'telegraf/scenes/wizard/context' {
  declare class WizardContext {
    constructor(
      ctx: ContextMessageUpdate,
      steps: Middleware<ContextMessageUpdate>[],
    );
    step: Middleware<ContextMessageUpdate> | false | undefined;
    selectStep(index: number): this;
    next(): this;
    back(): this;
  }

  export default WizardContext;
}

declare module 'telegraf/scenes/wizard' {
  import {
    Middleware,
    ContextMessageUpdate,
    Middleware,
    ContextMessageUpdate,
  } from 'telegraf';
  declare class WizardScene implements Composer {
    constructor(id: string, ...steps: Middleware<ContextMessageUpdate>[]);
    set ttl(value: number): void;

    get ttl(): number;

    leave(...fns: Middleware<ContextMessageUpdate>[]): this;

    leaveMiddleware(): Middleware<ContextMessageUpdate>;

    middleware(): Middleware<ContextMessageUpdate>;
  }

  export default WizardScene;
}

declare module 'telegraf/stage' {
  declare class Stage implements Composer {
    constructor(scenes: WizardScene[], options: any);

    register(...scenes: WizardScene[]): this;

    middleware(): Middleware<ContextMessageUpdate>;

    static enter(...scenes: string[]): WizardScene;

    static reenter(...scenes: string[]): WizardScene;

    static leave(...scenes: string[]): WizardScene;
  }
  export default Stage;
}
