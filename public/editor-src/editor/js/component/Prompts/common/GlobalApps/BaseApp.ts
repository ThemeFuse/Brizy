import { ElementType } from "react";

class BaseAppElement {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static onBeforeLoad(c: unknown, p: unknown): void | Promise<void> {
    console.log("onBeforeLoad");
  }
}

type TBaseAppElementTypes = typeof BaseAppElement;
export type BaseAppElementTypes = Omit<
  TBaseAppElementTypes,
  "BaseAppElement" | "prototype"
>;

type BaseAppSteps = undefined | ElementType | BaseAppElementTypes;

class BaseApp {
  static connect: BaseAppSteps = undefined;
  static account: BaseAppSteps = undefined;
  static fields: BaseAppSteps = undefined;
  static list: BaseAppSteps = undefined;
  static done: BaseAppSteps = undefined;
}

export type TBaseTypes = typeof BaseApp;
export type BaseTypes = Omit<TBaseTypes, "BaseApp" | "prototype">;
export type BaseKey = keyof BaseTypes;

export { BaseApp };
