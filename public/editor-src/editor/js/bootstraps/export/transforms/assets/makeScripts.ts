import * as cheerio from "cheerio";
import Config from "visual/global/Config";
import LibsConfig from "visual/bootstraps/libs.json";
import { assetUrl } from "visual/utils/asset";
import { LIBS_SCORE, MAIN_SCORE, MAIN_INIT_SCORE } from "./scores";
import { Asset, AssetLibsMap, ScriptsFree, ScriptsPro } from "./index";

type MakeScripts = {
  free: ScriptsFree;
  pro?: ScriptsPro;
};

// main => preview.js | preview.pro.js only one added in the page
// generic => contain [initMain]
// libsMap => contain all groups[libs] js
// libsSelectors = contain all libs selector found in page
export const makeScripts = ($doc: cheerio.CheerioAPI): MakeScripts => {
  const { free = [], pro = [] } = LibsConfig;
  const generic: Asset[] = [];
  const libsSelectors = new Set<string>();
  const libsMap: AssetLibsMap[] = [];

  // added previewJS
  const main: Asset = {
    name: "main",
    score: MAIN_SCORE,
    content: {
      type: "file",
      url: assetUrl("editor/js/preview.js"),
      attr: {
        class: "brz-script brz-script-preview"
      }
    },
    pro: false
  };

  // added emit init.dom
  generic.push({
    name: "initMain",
    score: MAIN_INIT_SCORE,
    content: {
      type: "inline",
      content: `document.addEventListener('DOMContentLoaded', () => window.Brz.emit("init.dom", jQuery(document.body)));`,
      attr: {
        class: "brz-script brz-script-emit"
      }
    },
    pro: false
  });

  // libs
  free.forEach(lib => {
    const { name, selectors } = lib;

    // generate lib map
    libsMap.push({
      name,
      selectors,
      score: LIBS_SCORE,
      content: {
        type: "file",
        url: assetUrl(`editor/js/${name}.js`),
        attr: {
          class: "brz-script brz-script-preview-lib",
          "data-group": name
        }
      },
      pro: false
    });

    // find lib selector in the page
    selectors.forEach(selector => {
      if ($doc(selector).length) {
        libsSelectors.add(selector);
      }
    });
  });

  // if don't have library on page
  // wee need add only jQuery
  if (libsSelectors.size === 0) {
    libsSelectors.add(".brz__group__jquery");
  }

  const scripts: MakeScripts = {
    free: {
      main,
      generic,
      libsMap,
      libsSelectors: [...libsSelectors]
    }
  };

  const proConfig = Config.getAll().pro;
  const proUrls = proConfig && proConfig.urls;

  // PRO
  if (proUrls) {
    const genericPro: Asset[] = [];
    const libsProSelectors = new Set<string>();
    const libsProMap: AssetLibsMap[] = [];
    const mainPro: Asset = {
      name: "main",
      score: MAIN_SCORE,
      content: {
        type: "file",
        url: `${proUrls.assets}/js/preview.pro.js`,
        attr: {
          class: "brz-script brz-script-preview-pro"
        }
      },
      pro: true
    };

    // libs
    pro.forEach(lib => {
      const { name, selectors } = lib;

      libsProMap.push({
        name,
        selectors,
        score: LIBS_SCORE + 1,
        content: {
          type: "file",
          url: `${proUrls.assets}/js/${name}.pro.js`,
          attr: {
            class: `brz-script brz-script-preview-lib-pro`,
            "data-group": name
          }
        },
        pro: true
      });

      // find lib selector in the page
      selectors.forEach(selector => {
        if ($doc(selector).length) {
          libsProSelectors.add(selector);
        }
      });
    });

    scripts.pro = {
      main: mainPro,
      generic: genericPro,
      libsMap: libsProMap,
      libsSelectors: [...libsProSelectors]
    };
  }

  return scripts;
};
