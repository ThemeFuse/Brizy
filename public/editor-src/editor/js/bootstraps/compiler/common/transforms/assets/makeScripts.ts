import type { CheerioAPI } from "cheerio";
import LibsConfig from "visual/bootstraps/libs.json";
import { getConsentBlockerScript } from "visual/editorComponents/CookieBanner/consent/blockerAsset";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { compileAssetProUrl, compileAssetUrl } from "visual/utils/asset";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import type { Asset, AssetLibsMap, ScriptsFree, ScriptsPro } from "./index";
import { CONSENT_BLOCKER_SCORE, LIBS_SCORE, MAIN_SCORE } from "./scores";

type MakeScripts = {
  free: ScriptsFree;
  pro?: ScriptsPro;
};

// main => preview.min.js | preview.pro.min.js only one added in the page
// generic => contain [initMain]
// libsMap => contain all groups[libs] js
// libsSelectors = contain all libs selector found in page
export const makeScripts = (
  $doc: CheerioAPI,
  config: ConfigCommon
): MakeScripts => {
  const { free = [], pro = [] } = LibsConfig;
  const generic: Asset[] = [];
  const libsSelectors = new Set<string>();
  const libsMap: AssetLibsMap[] = [];

  const { editorVersion, pro: proConfig } = config;

  // added previewJS
  const main: Asset = {
    name: "main",
    score: MAIN_SCORE,
    content: {
      type: "file",
      url: compileAssetUrl("editor/js/preview.min.js", config),
      attr: {
        class: "brz-script brz-script-preview",
        defer: "true"
      }
    },
    pro: false
  };

  // consent blocker: must load first (lowest score) and only when
  // the page actually has a banner to gate against
  if ($doc(".brz-cookie-banner").length > 0) {
    generic.push({
      name: "consentBlocker",
      score: CONSENT_BLOCKER_SCORE,
      pro: false,
      content: {
        type: "inline",
        content: getConsentBlockerScript(),
        attr: {
          class: "brz-script brz-script-consent"
        }
      }
    });
  }

  // find lib selector in the page
  const searchedLibs = new Set<string>();

  // libs
  free.forEach((lib) => {
    const { name, selectors } = lib;

    // generate lib map
    libsMap.push({
      name,
      selectors,
      score: LIBS_SCORE,
      content: {
        type: "file",
        url: compileAssetUrl(`editor/js/${name}.min.js`, config),
        attr: {
          class: "brz-script brz-script-preview-lib",
          defer: "true",
          ...makeDataAttr({ name: "group", value: name })
        }
      },
      pro: false
    });

    selectors.forEach((selector) => {
      if (searchedLibs.has(selector)) {
        return;
      }

      searchedLibs.add(selector);

      if ($doc(selector).length) {
        libsSelectors.add(selector);
      }
    });
  });

  const scripts: MakeScripts = {
    free: {
      main,
      version: editorVersion,
      generic,
      libsMap,
      libsSelectors: [...libsSelectors]
    }
  };

  // PRO
  if (proConfig) {
    const genericPro: Asset[] = [];
    const libsProSelectors = new Set<string>();
    const searchedLibs = new Set<string>();
    const libsProMap: AssetLibsMap[] = [];
    const mainPro: Asset = {
      name: "main",
      score: MAIN_SCORE,
      content: {
        type: "file",
        url: compileAssetProUrl(proConfig, "js/preview.pro.min.js"),
        attr: {
          class: "brz-script brz-script-preview-pro",
          defer: "true"
        }
      },
      pro: true
    };

    // libs
    pro.forEach((lib) => {
      const { name, selectors } = lib;

      libsProMap.push({
        name,
        selectors,
        score: LIBS_SCORE + 1,
        content: {
          type: "file",
          url: compileAssetProUrl(proConfig, `js/${name}.pro.min.js`),
          attr: {
            class: "brz-script brz-script-preview-lib-pro",
            defer: "true",
            ...makeDataAttr({ name: "group", value: name })
          }
        },
        pro: true
      });

      // find lib selector in the page
      selectors.forEach((selector) => {
        if (searchedLibs.has(selector)) {
          return;
        }

        searchedLibs.add(selector);

        if ($doc(selector).length) {
          libsProSelectors.add(selector);
        }
      });
    });

    scripts.pro = {
      main: mainPro,
      version: proConfig.version ?? "",
      generic: genericPro,
      libsMap: libsProMap,
      libsSelectors: [...libsProSelectors]
    };
  }

  return scripts;
};
