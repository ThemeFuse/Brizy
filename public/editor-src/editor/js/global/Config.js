import deepMerge from "deepmerge";

let _config = {};

export default {
  load: config => {
    _config = deepMerge(_config, config);
  },
  get: key => _config[key],
  getAll: () => _config
};
