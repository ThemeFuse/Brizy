import { pipe } from "visual/utils/fp";
import {
  Asset,
  ScriptsFree,
  ScriptsPro,
  StylesFree,
  StylesPro
} from "../transforms/assets";
import {
  combineStyles,
  getLibAsset,
  makeScripts,
  makeStyles,
  sortLibs
} from "./utils";

type AssetManager = (a: {
  freeStyles: StylesFree;
  freeScripts: ScriptsFree;
  proStyles?: StylesPro;
  proScripts?: ScriptsPro;
}) => {
  styles: Array<string>;
  scripts: Array<string>;
};

const getLibs = pipe(getLibAsset, (a) => (a ? [a] : []));

export const assetManager: AssetManager = ({
  freeStyles,
  freeScripts,
  proStyles,
  proScripts
}) => {
  const freeStylesLib = getLibs(freeStyles.libsMap, freeStyles.libsSelectors);
  const freeScriptsLib = getLibs(
    freeScripts.libsMap,
    freeScripts.libsSelectors
  );
  const allStylesFree: Array<Asset> = [
    ...freeStyles.generic,
    ...freeStyles.pageFonts,
    ...freeStyles.pageStyles,
    ...freeStylesLib
  ];
  const allScriptsFree: Array<Asset> = [
    ...freeScripts.generic,
    ...freeScriptsLib
  ];
  let allScriptsPro: Array<Asset> = [];
  let allStylesPro: Array<Asset> = [];

  if (proScripts) {
    const libs = getLibs(proScripts.libsMap, proScripts.libsSelectors);
    allScriptsPro = [...proScripts.generic, ...libs, proScripts.main];
  } else {
    allScriptsFree.push(freeScripts.main);
  }

  if (proStyles) {
    const libs = getLibs(proStyles.libsMap, proStyles.libsSelectors);
    allStylesPro = [...proStyles.generic, ...libs, proStyles.main];
  } else {
    allStylesFree.push(freeStyles.main);
  }

  const styles = combineStyles([...allStylesFree, ...allStylesPro])
    .sort(sortLibs)
    .map(makeStyles);
  const scripts = [...allScriptsFree, ...allScriptsPro]
    .sort(sortLibs)
    .map(makeScripts);

  return {
    styles,
    scripts
  };
};
