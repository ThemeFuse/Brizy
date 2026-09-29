import type { ElementType } from "react";

export interface BaseAppElementTypes {
  onBeforeLoad(c: unknown, p: unknown): void | Promise<void>;
}

type BaseAppSteps = undefined | ElementType | BaseAppElementTypes;

// biome-ignore lint/complexity/noStaticOnlyClass: 28 app classes extend this (`class Google extends BaseApp`), so it is an inheritance root supplying the 10 step defaults - rewriting it as a module would force every subclass to redeclare all 10
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
