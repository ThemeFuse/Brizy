import * as cheerio from "cheerio";
import Config from "visual/global/Config";
import LibsConfig from "visual/bootstraps/libs.json";
import { assetUrl } from "visual/utils/asset";
import {
  DEPENDENCY_SCORE,
  LIBS_SCORE,
  MAIN_SCORE,
  OTHERS_SCORE
} from "./scores";
import { makePrefetchFonts } from "visual/utils/fonts";
import { getFontLinks } from "./getProjectFonts";
import { getProjectStyles, getTypographyStyles } from "./getProjectStyles";
import { getCustomCSS } from "./getCustomCSS";
import { getDCColor } from "./getDCColor";
import {
  Asset,
  AssetUpload,
  AssetGoogle,
  AssetLibsMap,
  Fonts,
  StylesFree,
  StylesPro
} from "./index";
import { toHashCode } from "visual/utils/string";

type MakeStyles = {
  free: StylesFree;
  pro?: StylesPro;
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
        attr: {
          class: "brz-link brz-link-google",
          type: "text/css",
          rel: "stylesheet"
        }
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
        attr: {
          class: "brz-link brz-link-upload",
          type: "text/css",
          rel: "stylesheet"
        }
      },
      pro: false
    });
  }

  return pageFonts;
};

const makePageStyles = ($doc: cheerio.CheerioAPI): Asset[] => {
  const prefetchLinks: Asset = {
    name: "projectPrefetchFonts",
    score: DEPENDENCY_SCORE,
    content: {
      type: "code",
      content: makePrefetchFonts().join(" ")
    },
    pro: false
  };

  const paletteStyles: Asset = {
    name: "projectPalette",
    score: OTHERS_SCORE,
    content: {
      type: "inline",
      content: getProjectStyles($doc),
      attr: {
        class: "brz-style brz-project__style-palette"
      }
    },
    pro: false
  };
  const typography = getTypographyStyles($doc);
  const typographyStyles: Asset = {
    name: toHashCode(typography),
    score: OTHERS_SCORE,
    content: {
      type: "inline",
      content: typography,
      attr: {
        class: "brz-style brz-project__style-fonts"
      }
    },
    pro: false
  };

  return [prefetchLinks, paletteStyles, typographyStyles];
};

const makeCustomCSS = ($doc: cheerio.CheerioAPI): Asset[] => {
  return getCustomCSS($doc).map((style, index) => ({
    name: toHashCode(style),
    score: OTHERS_SCORE,
    content: {
      type: "inline",
      content: style,
      attr: {
        id: `brz-custom-css-${index}`,
        class: "brz-style"
      }
    },
    pro: false
  }));
};

const makeDCColor = ($doc: cheerio.CheerioAPI): Asset[] => {
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

const makeDynamicStyle = ($doc: cheerio.CheerioAPI): Asset => {
  const $styles = $doc("style.brz-style");
  const __html = $doc.html($styles);
  const otherStyles: Asset = {
    name: toHashCode(__html),
    score: OTHERS_SCORE,
    content: {
      type: "code",
      content: __html
    },
    pro: false
  };
  $styles.remove();

  return otherStyles;
};

// main => preview.css | preview.pro.css only one added in the page
// generic => contain [dynamic css style]
// libsMap => contain all groups[libs] css
// libsSelectors = contain all libs selector found in page
// pageFonts => link for google and upload fonts
// pageStyles => styles generated for richText
export const makeStyles = (
  $doc: cheerio.CheerioAPI,
  fonts: Fonts
): MakeStyles => {
  const { free = [], pro = [] } = LibsConfig;
  const main: Asset = {
    name: "main",
    score: MAIN_SCORE,
    content: {
      type: "file",
      url: assetUrl("editor/css/preview.css"),
      attr: {
        class: "brz-link brz-link-preview",
        rel: "stylesheet"
      }
    },
    pro: false
  };
  const generic: Asset[] = [];

  // project fonts
  const pageFonts = makePageFonts(fonts);

  // project styles
  const pageStyles = makePageStyles($doc);

  // page meta viewport
  const metaViewport = makePageMetaViewport();
  generic.push(metaViewport);

  // custom CSS
  const customCSS = makeCustomCSS($doc);
  generic.push(...customCSS);

  // dynamic Content Color
  const dcColor = makeDCColor($doc);
  generic.push(...dcColor);

  // dynamic styles
  const dynamicStyles = makeDynamicStyle($doc);
  generic.push(dynamicStyles);

  const libsMap: AssetLibsMap[] = [];
  const libsSelectors = new Set<string>();

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
        url: assetUrl(`editor/css/${name}.css`),
        attr: {
          class: "brz-link brz-link-preview-lib",
          rel: "stylesheet",
          "data-group": name
        }
      },
      pro: false
    });

    // selectors
    // find lib selector in the page
    selectors.forEach(selector => {
      if ($doc(selector).length) {
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

  // pro
  const proConfig = Config.get("pro");
  const proUrls = proConfig && proConfig.urls;

  if (proUrls) {
    const genericPro: Asset[] = [];
    const libsProSelectors = new Set<string>();
    const libsProMap: AssetLibsMap[] = [];
    const mainPro: Asset = {
      name: "main",
      score: MAIN_SCORE,
      content: {
        type: "file",
        url: `${proUrls.assets}/css/preview.pro.css`,
        attr: {
          class: "brz-link brz-link-preview-pro",
          rel: "stylesheet"
        }
      },
      pro: true
    };

    // libs
    pro.forEach(lib => {
      const { name, selectors } = lib;

      // generate lib map
      libsProMap.push({
        name,
        selectors,
        score: LIBS_SCORE + 1,
        content: {
          type: "file",
          url: `${proUrls.assets}/css/${name}-pro.css`,
          attr: {
            class: "brz-link brz-link-preview-lib-pro",
            rel: "stylesheet",
            "data-group": name
          }
        },
        pro: true
      });

      // selectors
      // find lib selector in the page
      selectors.forEach(selector => {
        if ($doc(selector).length) {
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
