import deepMerge from "deepmerge";

type TConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
};

let _config: TConfig = {};

export default {
  load(config: TConfig): void {
    _config = deepMerge(_config, config);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(key: string): any {
    return _config[key];
  },
  getAll(): TConfig {
    return _config;
  }
};
