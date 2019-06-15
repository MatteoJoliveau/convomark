import { BindingKey } from "@loopback/core";
import { ApplicationMode } from "./applicationMode.provider";

export namespace ConvoMarkBindings {
  export const APPLICATION_MODE = BindingKey.create<ApplicationMode>('application.mode')
}
