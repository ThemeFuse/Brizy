// BrizyLibs & BrizyProLibs is created by rspack with library || libraryTarget
// see BrizyLibs in rspack.config.preview.js and BrizyProLibs in rspack.config.pro.js
const getFreeLibs = () => {
  return window.BrizyLibs || {};
};

const getProLibs = () => {
  return window.BrizyProLibs || {};
};

export { getFreeLibs, getProLibs };
