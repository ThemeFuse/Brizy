import LibsConfig from "visual/bootstraps/libs.json";
import Config from "visual/global/Config";
import { compileAssetProUrl, compileAssetUrl } from "visual/utils/asset";
import { IS_WP } from "visual/utils/env";
import { makePrefetchFonts } from "visual/utils/fonts";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { toHashCode } from "visual/utils/string";
import { getCustomCSS } from "./getCustomCSS";
import { getDCColor } from "./getDCColor";
import { getFontLinks } from "./getProjectFonts";
import {
  Asset,
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
  LIBS_SCORE,
  MAIN_SCORE,
  OTHERS_SCORE
} from "./scores";

type MakeStyles = {
  free: StylesFree;
  pro?: StylesPro;
};

const withRel = (attr: Record<string, string>): Record<string, string> => {
  return IS_WP ? attr : { ...attr, rel: "stylesheet" };
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

const makePageFontsPrefetch = (fonts: Fonts): Array<Asset> => {
  const content = getFontLinks(fonts)?.google;

  if (content) {
    return [
      {
        name: "projectPrefetchFonts",
        score: DEPENDENCY_SCORE,
        content: {
          type: "code",
          content: makePrefetchFonts().join(" ")
        },
        pro: false
      }
    ];
  }

  return [];
};

const makePageFonts = (fonts: Fonts): (AssetGoogle | AssetUpload)[] => {
  const { google, upload } = getFontLinks(fonts);
  const pageFonts: (AssetGoogle | AssetUpload)[] = [];

  if (google) {
    pageFonts.push({
      name: "google",
      type: "google-font",
      score: DEPENDENCY_SCORE,
      content: {
        type: "file",
        url: google,
        attr: withRel({
          class: "brz-link brz-link-google",
          type: "text/css"
        })
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
        attr: withRel({
          class: "brz-link brz-link-upload",
          type: "text/css"
        })
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

const makeDCColor = ($doc: cheerio.Root): Asset[] => {
  return getDCColor($doc).map((style, index) => ({
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
  let cssText = "";

  for (const [, cssModel] of css) {
    cssText += cssModel.cssText;
    cssText += "\n";
  }

  return [
    {
      name: toHashCode(cssText),
      score: OTHERS_SCORE,
      content: {
        type: "inline",
        content: cssText,
        attr: {
          class: "brz-style"
        }
      },
      pro: false
    }
  ];
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
}
export const makeStyles = (data: Data): MakeStyles => {
  const { $root, fonts, css } = data;
  const { free = [], pro = [] } = LibsConfig;
  const main: Asset = {
    name: "main",
    score: MAIN_SCORE,
    content: {
      type: "file",
      url: compileAssetUrl("editor/css/preview.min.css"),
      attr: withRel({
        class: "brz-link brz-link-preview"
      })
    },
    pro: false
  };
  const generic: Asset[] = [];

  // project fonts
  const pageFonts = makePageFonts(fonts);

  // page styles
  const pageStyles = makePageFontsPrefetch(fonts);

  // page meta viewport
  const metaViewport = makePageMetaViewport();
  generic.push(metaViewport);

  // custom CSS
  const customCSS = makeCustomCSS($root);
  generic.push(...customCSS);

  // dynamic content color
  const dcColor = makeDCColor($root);
  generic.push(...dcColor);

  // dynamic styles
  const dynamicStyles = makeDynamicStyle(css);
  generic.push(...dynamicStyles);

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
        url: compileAssetUrl(`editor/css/${name}.min.css`),
        attr: withRel({
          class: "brz-link brz-link-preview-lib",
          ...makeDataAttr({ name: "group", value: name })
        })
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
  const proConfig = Config.getAll().pro;

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
        attr: withRel({
          class: "brz-link brz-link-preview-pro"
        })
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
          attr: withRel({
            class: "brz-link brz-link-preview-lib-pro",
            ...makeDataAttr({ name: "group", value: name })
          })
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
