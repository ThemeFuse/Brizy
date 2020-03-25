import "@babel/polyfill";

import React from "react";
import ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import { renderStatic } from "glamor/server";
import cheerio from "cheerio";
import deepMerge from "deepmerge";

import {
  parsePage,
  parseProject,
  parseGlobalBlock
} from "visual/utils/api/editor/adapter";
import {
  getUsedModelsFonts,
  getUsedStylesFonts,
  getBlocksStylesFonts
} from "visual/utils/traverse";
import {
  findFonts,
  projectFontsData,
  getDefaultFont
} from "visual/utils/fonts";

import { createStore } from "visual/redux/store";
import { hydrate } from "visual/redux/actions";

import EditorGlobal from "visual/global/Editor";
import "../registerEditorParts";

import addFonts from "./transforms/addFonts";
import addDefaultFont from "./transforms/addDefaultFont";
import addColorPaletteCSS from "./transforms/addColorPaletteCSS";
import addFontStylesCSS from "./transforms/addFontStylesCSS";
import addCustomCSS from "./transforms/addCustomCSS";
import changeRichText from "./transforms/changeRichText";
import changeRichTextDCColor from "./transforms/changeRichTextDCColor";
import extractPopups from "./transforms/extractPopups";

import { items as googleFonts } from "visual/config/googleFonts.json";
import { css, tmpCSSFromCache } from "visual/utils/cssStyle";
import { flatMap } from "visual/utils/array";

import { IS_GLOBAL_POPUP } from "visual/utils/models";

export default function main({
  pageId,
  pages,
  project,
  globalBlocks: globalBlocks_
}) {
  const page = pages
    .map(parsePage)
    .find(page => (pageId ? page.id === pageId : page.is_index));
  const globalBlocks = globalBlocks_
    .map(parseGlobalBlock)
    .reduce((acc, { uid, data, dataVersion }) => {
      acc[uid] = { id: uid, data, dataVersion };
      return acc;
    }, {});

  if (!page) {
    throw new Error(`can not find page with id ${pageId}`);
  }

  return {
    meta: getPageMeta({ page }),
    blocks: getPageBlocks({
      page,
      project,
      globalBlocks,
      googleFonts
    })
  };
}

function getPageMeta({ page }) {
  return {
    slug: page.slug || "",
    title: page.title || "",
    description: page.description || ""
  };
}

function getPageBlocks({ page, project: _project, globalBlocks, googleFonts }) {
  const store = createStore();
  const project = parseProject(_project);
  const { fonts, font: projectDefaultFont } = project.data;

  // NEW FONTS FOUND
  // some fonts are found in models
  // that are not present in project
  // we need to find them in google
  // and add them to the project
  const parsedFonts = parseFonts(page, project, globalBlocks);
  let blocksFonts = [];

  getBlocksStylesFonts(parsedFonts, fonts).forEach(({ type, family }) => {
    if (type === "google" || type === "unknowns") {
      const font = findFonts(googleFonts, family);

      if (font) {
        blocksFonts.push(font);
      }
    }
  });

  const _fonts = deepMerge(fonts, {
    blocks: {
      data: blocksFonts
    }
  });

  store.dispatch(
    hydrate({
      page,
      project,
      fonts: _fonts,
      globalBlocks,
      savedBlocks: {},
      projectStatus: {}
    })
  );

  const { Page, PagePopup } = EditorGlobal.getComponents();
  const reduxState = store.getState();

  // === TMP ===
  css.isServer = true;
  // ===========

  const { html, css: glamorCSS } = renderStatic(() =>
    ReactDOMServer.renderToStaticMarkup(
      <Provider store={store}>
        {IS_GLOBAL_POPUP ? (
          <PagePopup dbValue={reduxState.page.data} reduxState={reduxState} />
        ) : (
          <Page dbValue={reduxState.page.data} reduxState={reduxState} />
        )}
      </Provider>
    )
  );

  // === TMP ===
  const brzCss = tmpCSSFromCache();
  // ===========

  const $pageHTML = cheerio.load(
    `<html><head><style class="brz-style">${glamorCSS}</style><style class="brz-style">${brzCss}</style></head><body>${html}</body></html>`
  );

  // get all Fonts from page
  // uses for generate <link> with fontFamily
  let fontMap = {
    google: [],
    upload: []
  };
  const { upload = [], google = [] } = projectFontsData(_fonts);
  const defaultFont = getDefaultFont(reduxState);
  let includedDefaultProjectFont = false;

  parsedFonts.forEach(({ type, family }) => {
    if (!includedDefaultProjectFont) {
      includedDefaultProjectFont = projectDefaultFont === family;
    }

    switch (type) {
      case "upload": {
        const font = findFonts(upload, family, "upload");
        font && fontMap.upload.push(font);
        break;
      }
      case "google": {
        const font = findFonts(google, family);
        font && fontMap.google.push(font);
        break;
      }
      case "unknowns": {
        const uploadFont = findFonts(upload, family, "upload");

        if (uploadFont) {
          fontMap.upload.push(uploadFont);
        } else {
          const font = findFonts(google, family);
          font && fontMap.google.push(font);
        }
        break;
      }
    }
  });

  // Added Default project font
  if (!includedDefaultProjectFont) {
    const { group, font } = getDefaultFont();

    if (group === "upload") {
      fontMap.upload.push(font);
    } else {
      fontMap.google.push(font);
    }
  }

  // transforms
  changeRichTextDCColor($pageHTML);
  addColorPaletteCSS($pageHTML);
  addFontStylesCSS($pageHTML);
  addFonts($pageHTML, fontMap);
  addDefaultFont($pageHTML, defaultFont);
  addCustomCSS($pageHTML);
  changeRichText($pageHTML);
  extractPopups($pageHTML);

  return {
    head: $pageHTML("head").html(),
    body: $pageHTML("body").html()
  };
}

/**
 * parseFonts() returns arrays of fonts
 * used in page and project [{ family: "lato", type: "google" }]
 */
function parseFonts(page, project, globalBlocks) {
  if (parseFonts.cache) {
    return parseFonts.cache;
  }

  // get fonts from page
  const pageFonts = getUsedModelsFonts({
    models: page.data,
    globalBlocks
  });

  // get fonts from styles
  const { styles, extraFontStyles = [] } = project.data;
  const fontStyles = flatMap(styles, ({ fontStyles }) => fontStyles);
  const stylesFonts = getUsedStylesFonts([...fontStyles, ...extraFontStyles]);

  // merge fonts
  const allFonts = [...pageFonts, ...stylesFonts].reduce((acc, curr) => {
    return acc.some(({ family }) => family === curr.family)
      ? acc
      : [...acc, curr];
  }, []);

  parseFonts.cache = allFonts;

  return allFonts;
}
