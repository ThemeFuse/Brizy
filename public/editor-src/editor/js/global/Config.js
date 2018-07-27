import deepExtend from "deep-extend";

const _config = {};

export default {
  load: config => deepExtend(_config, config),
  get: key => _config[key],
  getAll: () => _config
};
