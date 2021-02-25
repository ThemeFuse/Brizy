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
import { getFontLinks, getFontStyles } from "./getProjectFonts";
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
  content:
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
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
      content: google,
      pro: false
    });
  }

  if (upload) {
    pageFonts.push({
      name: "upload",
      type: "uploaded-font",
      score: DEPENDENCY_SCORE,
      content: upload,
      pro: false
    });
  }

  return pageFonts;
};

const makePageStyles = ($doc: cheerio.CheerioAPI, fonts: Fonts): Asset[] => {
  const prefetchLinks = {
    name: "projectPrefetchFonts",
    score: DEPENDENCY_SCORE,
    content: makePrefetchFonts().join(" "),
    pro: false
  };

  const fontStyles = getFontStyles(fonts).map(style => ({
    name: toHashCode(style),
    score: DEPENDENCY_SCORE,
    content: style,
    pro: false
  }));
  const paletteStyles = {
    name: "projectPalette",
    score: OTHERS_SCORE,
    content: getProjectStyles(),
    pro: false
  };
  const typography = getTypographyStyles($doc);
  const typographyStyles = {
    name: toHashCode(typography),
    score: OTHERS_SCORE,
    content: typography,
    pro: false
  };

  return [prefetchLinks, ...fontStyles, paletteStyles, typographyStyles];
};

const makeCustomCSS = ($doc: cheerio.CheerioAPI): Asset[] => {
  return getCustomCSS($doc).map(style => ({
    name: toHashCode(style),
    score: OTHERS_SCORE,
    content: style,
    pro: false
  }));
};

const makeDCColor = ($doc: cheerio.CheerioAPI): Asset[] => {
  return getDCColor($doc).map(style => ({
    name: toHashCode(style),
    score: OTHERS_SCORE,
    content: style,
    pro: false
  }));
};

const makeDynamicStyle = ($doc: cheerio.CheerioAPI): Asset => {
  const $styles = $doc("style.brz-style");
  const __html = $doc.html($styles);
  const otherStyles = {
    name: toHashCode(__html),
    score: OTHERS_SCORE,
    content: __html,
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
  const previewCSS = assetUrl("editor/css/preview.css");
  const main: Asset = {
    name: "main",
    score: MAIN_SCORE,
    content: `<link class="brz-link brz-link-preview" href="${previewCSS}" rel="stylesheet"/>`,
    pro: false
  };
  const generic: Asset[] = [];

  // project fonts
  const pageFonts = makePageFonts(fonts);

  // project styles
  const pageStyles = makePageStyles($doc, fonts);

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
    const cssUrl = assetUrl(`editor/css/${lib.name}.css`);

    // generate lib map
    libsMap.push({
      name,
      selectors,
      score: LIBS_SCORE,
      content: `<link class="brz-link brz-link-preview-lib" href="${cssUrl}" rel="stylesheet"/>`,
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
    const previewProCSS = `${proUrls.assets}/css/preview.pro.css`;
    const mainPro = {
      name: "main",
      score: MAIN_SCORE,
      content: `<link class="brz-link brz-link-preview-pro" href="${previewProCSS}" rel="stylesheet"/>`,
      pro: true
    };

    // libs
    pro.forEach(lib => {
      const { name, selectors } = lib;
      const cssUrl = `${proUrls.assets}/css/${name}-pro.css`;

      // generate lib map
      libsProMap.push({
        name,
        selectors,
        score: LIBS_SCORE + 1,
        content: `<link class="brz-link brz-link-preview-lib-pro" href="${cssUrl}" rel="stylesheet"/>`,
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
