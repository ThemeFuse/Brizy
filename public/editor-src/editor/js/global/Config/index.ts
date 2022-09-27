import deepMerge from "deepmerge";
import { Config,  isWp, isCMS } from "./types";
import { Cloud } from "./types/configs/Cloud";
import { WP } from "./types/configs/WP";


export type { Cloud, WP, Config };
export { isWp, isCMS };

// all-possible-keys-of-an-union-type
// was taken here https://stackoverflow.com/questions/49401866/all-possible-keys-of-an-union-type
type KeysOfUnion<T> = T extends T ? keyof T: never;

let _config = {} as Config;

export default {
  init(config: Config): void {
    _config = config;
  },
  /**
   *
   * @deprecated - there shouldn't be possibility dynamically add
   * new properties to config
   */
  load(config: Partial<Config>): void {
    _config = deepMerge<Config, Config>(_config, config);
  },
  /**
   * @deprecated - use getAll instead of this fn
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(key: KeysOfUnion<Config>): any {
    // @ts-expect-error - this fn is deprecated and should be removed
    return _config[key];
  },
  getAll(): Config {
    return _config;
  }
};

