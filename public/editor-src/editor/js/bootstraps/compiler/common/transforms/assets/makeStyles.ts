import LibsConfig from "visual/bootstraps/libs.json";
import { Config, isWp } from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ExtraFontData } from "visual/types/Fonts";
import { compileAssetProUrl, compileAssetUrl } from "visual/utils/asset";
import { makePrefetchFonts } from "visual/utils/fonts/makeFontsUrl";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { toHashCode } from "visual/utils/string";
import { getCustomCSS } from "./getCustomCSS";
import { getDCColor } from "./getDCColor";
import { getFontLinks } from "./getProjectFonts";
import {
  Asset,
  AssetAdobe,
  AssetGoogle,
  AssetLibsMap,
  AssetUpload,
  DynamicCSS,
  Fonts,
  StylesFree,
  StylesPro
} from "./index";
import {
  CUSTOM_CODE,
  DEPENDENCY_SCORE,
  DYNAMIC_CUSTOM_CSS,
  DYNAMIC_DEFAULT_CSS,
  DYNAMIC_RULES_CSS,
  LIBS_SCORE,
  MAIN_SCORE,
  OTHERS_SCORE,
  THIRD_PARTY_SCORE
} from "./scores";

type MakeStyles = {
  free: StylesFree;
  pro?: StylesPro;
};

const withRel = (
  attr: Record<string, string>,
  config: Config
): Record<string, string> => {
  return isWp(config) ? attr : { ...attr, rel: "stylesheet" };
};

const makePageMetaViewport = (): Asset => ({
  name: "metaViewport",
  score: DEPENDENCY_SCORE,
  content: {
    type: "code",
    content:
      '<meta name="viewport" content="width=device-width, initial-scale=1">'
  },
  pro: false
});

const makePageFontsPrefetch = (
  fonts: Fonts,
  config: ConfigCommon
): Array<Asset> => {
  const content = getFontLinks({ ...fonts, config })?.google;

  if (content) {
    return [
      {
        name: "projectPrefetchFonts",
        score: DEPENDENCY_SCORE,
        content: {
          type: "code",
          content: makePrefetchFonts(config).join(" ")
        },
        pro: false
      }
    ];
  }

  return [];
};

const makePageFonts = (data: {
  fonts: Fonts;
  extra?: ExtraFontData;
  config: Config;
}): (AssetGoogle | AssetUpload | AssetAdobe)[] => {
  const { fonts, extra, config } = data;
  const { google, upload, adobe } = getFontLinks({ ...fonts, extra, config });
  const pageFonts: (AssetGoogle | AssetUpload | AssetAdobe)[] = [];

  if (adobe) {
    pageFonts.push({
      name: "adobe",
      type: "adobe-font",
      score: DEPENDENCY_SCORE,
      content: {
        type: "file",
        url: adobe,
        attr: withRel(
          { class: "brz-link brz-link-adobe", type: "text/css" },
          config
        )
      },
      pro: true
    });
  }

  if (google) {
    pageFonts.push({
      name: "google",
      type: "google-font",
      score: DEPENDENCY_SCORE,
      content: {
        type: "file",
        url: google,
        attr: withRel(
          { class: "brz-link brz-link-google", type: "text/css" },
          config
        )
      },
      pro: false
    });
  }

  if (upload) {
    pageFonts.push({
      name: "upload",
      type: "uploaded-font",
      score: DEPENDENCY_SCORE,
      content: {
        type: "file",
        url: upload,
        attr: withRel(
          { class: "brz-link brz-link-upload", type: "text/css" },
          config
        )
      },
      pro: false
    });
  }

  return pageFonts;
};

const normalizeCustomCSS = (styles: string): string =>
  styles.replace(/&(quot|#x27|amp|gt);/g, (match: string): string => {
    switch (match) {
      case "&quot;":
        return '"';
      case "&#x27;":
        return "'";
      case "&amp;":
        return "&";
      case "&gt;":
        return ">";
    }
    return "";
  });

const makeCustomCSS = ($doc: cheerio.Root): Asset[] => {
  return getCustomCSS($doc).map((style, index) => ({
    name: toHashCode(style),
    score: CUSTOM_CODE,
    content: {
      type: "inline",
      content: normalizeCustomCSS(style),
      attr: {
        id: `brz-custom-css-${index}`,
        class: "brz-style"
      }
    },
    pro: false
  }));
};

const makeDCColor = ($doc: cheerio.Root, config: ConfigCommon): Asset[] => {
  return getDCColor($doc, config).map((style, index) => ({
    name: toHashCode(style),
    score: OTHERS_SCORE,
    content: {
      type: "inline",
      content: style,
      attr: {
        id: `brz-dc-color-${index}`,
        class: "brz-style"
      }
    },
    pro: false
  }));
};

const makeDynamicStyle = (css: DynamicCSS): Asset[] => {
  const cssText: Array<Asset> = [];
  const { default: defaultCSS, rules, custom } = css;

  for (const cssModel of defaultCSS) {
    cssText.push({
      name: toHashCode(cssModel.cssText),
      score: DYNAMIC_DEFAULT_CSS,
      content: {
        type: "inline",
        content: cssModel.cssText,
        attr: {
          class: "brz-style"
        }
      },
      pro: false
    });
  }

  for (const cssModel of rules) {
    cssText.push({
      name: toHashCode(cssModel.cssText),
      score: DYNAMIC_RULES_CSS,
      content: {
        type: "inline",
        content: cssModel.cssText,
        attr: {
          class: "brz-style"
        }
      },
      pro: false
    });
  }

  for (const cssModel of custom) {
    cssText.push({
      name: toHashCode(cssModel.cssText),
      score: DYNAMIC_CUSTOM_CSS,
      content: {
        type: "inline",
        content: cssModel.cssText,
        attr: {
          class: "brz-style"
        }
      },
      pro: false
    });
  }

  return cssText;
};

// main => preview.min.css | preview.pro.min.css only one added in the page
// generic => contain [dynamic css style]
// libsMap => contain all groups[libs] css
// libsSelectors = contain all libs selector found in page
// pageFonts => link for google and upload fonts
// pageStyles => styles generated for richText
interface Data {
  $root: cheerio.Root;
  fonts: Fonts;
  css: DynamicCSS;
  config: ConfigCommon;
  extra?: { adobeKitId?: string };
}
export const makeStyles = (data: Data): MakeStyles => {
  const { $root, fonts, css, config, extra } = data;
  const { free = [], pro = [] } = LibsConfig;

  const main: Asset = {
    name: "main",
    score: MAIN_SCORE,
    content: {
      type: "file",
      url: compileAssetUrl("editor/css/preview.min.css", config),
      attr: withRel({ class: "brz-link brz-link-preview" }, config as Config)
    },
    pro: false
  };
  const generic: Asset[] = [];

  // project fonts
  const pageFonts = makePageFonts({ fonts, extra, config: config as Config });

  // page styles
  const pageStyles = makePageFontsPrefetch(fonts, config);

  // page meta viewport
  const metaViewport = makePageMetaViewport();
  generic.push(metaViewport);

  // custom CSS
  const customCSS = makeCustomCSS($root);
  generic.push(...customCSS);

  // dynamic content color
  const dcColor = makeDCColor($root, config);
  generic.push(...dcColor);

  // dynamic styles
  const dynamicStyles = makeDynamicStyle(css);
  generic.push(...dynamicStyles);

  // thirdParty styles
  const thirdPartyUrls = config.thirdPartyUrls ?? [];

  thirdPartyUrls.forEach(({ styleUrl }) => {
    if (styleUrl) {
      generic.push({
        name: `third-party-${toHashCode(styleUrl)}`,
        score: THIRD_PARTY_SCORE,
        pro: false,
        content: {
          type: "file",
          url: styleUrl
        }
      });
    }
  });

  const libsMap: AssetLibsMap[] = [];
  const libsSelectors = new Set<string>();

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
        url: compileAssetUrl(`editor/css/${name}.min.css`, config),
        attr: withRel(
          {
            class: "brz-link brz-link-preview-lib",
            ...makeDataAttr({ name: "group", value: name })
          },
          config as Config
        )
      },
      pro: false
    });

    // selectors
    // find lib selector in the page
    selectors.forEach((selector) => {
      if ($root(selector).length) {
        libsSelectors.add(selector);
      }
    });
  });

  const styles: MakeStyles = {
    free: {
      main,
      pageFonts,
      pageStyles,
      generic,
      libsMap,
      libsSelectors: [...libsSelectors]
    }
  };

  // PRO
  const proConfig = config.pro;

  if (proConfig) {
    const genericPro: Asset[] = [];
    const libsProSelectors = new Set<string>();
    const libsProMap: AssetLibsMap[] = [];
    const mainPro: Asset = {
      name: "main",
      score: MAIN_SCORE,
      content: {
        type: "file",
        url: compileAssetProUrl(proConfig, "css/preview.pro.min.css"),
        attr: withRel(
          { class: "brz-link brz-link-preview-pro" },
          config as Config
        )
      },
      pro: true
    };

    // libs
    pro.forEach((lib) => {
      const { name, selectors } = lib;

      // generate lib map
      libsProMap.push({
        name,
        selectors,
        score: LIBS_SCORE + 1,
        content: {
          type: "file",
          url: compileAssetProUrl(proConfig, `css/${name}-pro.min.css`),
          attr: withRel(
            {
              class: "brz-link brz-link-preview-lib-pro",
              ...makeDataAttr({ name: "group", value: name })
            },
            config as Config
          )
        },
        pro: true
      });

      // selectors
      // find lib selector in the page
      selectors.forEach((selector) => {
        if ($root(selector).length) {
          libsProSelectors.add(selector);
        }
      });
    });

    styles.pro = {
      main: mainPro,
      generic: genericPro,
      libsMap: libsProMap,
      libsSelectors: [...libsProSelectors]
    };
  }

  return styles;
};
