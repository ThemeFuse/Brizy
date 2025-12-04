import { ElementType } from "react";

class _BaseAppElement {
  static onBeforeLoad(c: unknown, p: unknown): void | Promise<void> {
    // eslint-disable-next-line no-console
    console.log("onBeforeLoad", c, p);
  }
}

type TBaseAppElementTypes = typeof _BaseAppElement;
export type BaseAppElementTypes = Omit<
  TBaseAppElementTypes,
  "_BaseAppElement" | "prototype"
>;

type BaseAppSteps = undefined | ElementType | BaseAppElementTypes;

class BaseApp {
  static disconnect: BaseAppSteps = undefined;
  static client: BaseAppSteps = undefined;
  static upload: BaseAppSteps = undefined;
  static appList: BaseAppSteps = undefined;
  static variation: BaseAppSteps = undefined;
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
