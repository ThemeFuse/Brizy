import { ShopModules } from "./configs/Base";
import { EkklesiaModules } from "./configs/modules/ekklesia/Ekklesia";

interface CommonModules {
  ekklesia: EkklesiaModules;
}

interface CloudModules extends CommonModules {
  shop: ShopModules;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface WPModules extends CommonModules {}

type Config = {
  cloud: CloudModules;
  wp: WPModules;
};

export type Module<T extends "wp" | "cloud"> = Config[T] | undefined;
