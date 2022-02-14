// BrizyLibs & BrizyProLibs is created by webpack with library || libraryTarget
// see BrizyLibs in webpack.config.preview.js and BrizyProLibs in webpack.config.pro.js
const getFreeLibs = () => {
  return window.BrizyLibs || {};
};

const getProLibs = () => {
  return window.BrizyProLibs || {};
};

export { getFreeLibs, getProLibs };
