import { ShopModules } from "./configs/Base";
import { EkklesiaModules } from "./configs/modules/ekklesia/Ekklesia";
import { Obj } from "@brizy/readers";

interface CommonModules {
  ekklesia: EkklesiaModules;
}

export interface CloudModules extends CommonModules {
  shop: ShopModules;
}

export const isCloudWithShopModules = (obj: unknown): obj is CloudModules => {
  return Obj.isObject(obj) && Obj.hasKey("shop", obj);
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface WPModules extends CommonModules {}

type Config = {
  cloud: CloudModules;
  wp: WPModules;
};

export type Module<T extends "wp" | "cloud"> = Config[T] | undefined;
