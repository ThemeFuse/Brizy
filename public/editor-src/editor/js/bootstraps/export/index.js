import React from "react";
import ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import { renderStatic } from "glamor/server";
import cheerio from "cheerio";
import deepMerge from "deepmerge";

import { items as googleFonts } from "visual/config/googleFonts.json";

import * as Str from "visual/utils/reader/string";
import {
  parsePageCommon,
  parseProject,
  parseGlobalBlock
} from "visual/utils/api/adapter";
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
import { getBlocksInPage } from "visual/utils/blocks";
import { css, tmpCSSFromCache } from "visual/utils/cssStyle";
import { flatMap } from "visual/utils/array";
import { IS_GLOBAL_POPUP } from "visual/utils/models";

import { createStore } from "visual/redux/store";
import { pageDataDraftBlocksSelector } from "visual/redux/selectors";
import { hydrate } from "visual/redux/actions";

import EditorGlobal from "visual/global/Editor";
import "../registerEditorParts";

import { getAssets } from "./transforms/assets";
import changeRichText from "./transforms/changeRichText";
import extractPopups from "./transforms/extractPopups";
import dynamicContent from "./transforms/dynamicContent";
import replaceIcons from "./transforms/replaceIcons";

export default async function main({
  pageId,
  pages,
  project,
  globalBlocks: globalBlocks_,
  buildPath
}) {
  // ! pages.map(parsePageCommon)  removes collectionType property
  // ! .map((page, i) => ({ ...page, collectionType: pages[i].collectionType })) - this is a temp
  const page = pages
    .map(parsePageCommon)
    .map((page, i) => ({
      ...page,
      collectionType: pages[i].collectionType,
      fields: pages[i].fields
    }))
    .find(page => {
      if (pageId) {
        const pageId1 = Str.read(page.id);
        const pageId2 = Str.read(pageId);

        return pageId1 && pageId2 && pageId1 === pageId2;
      } else {
        return page.is_index;
      }
    });

  if (!page) {
    throw new Error(`can not find page with id ${pageId}`);
  }

  const globalBlocks = globalBlocks_
    .map(parseGlobalBlock)
    .reduce((acc, { uid, data, rules, position, status, dataVersion }) => {
      acc[uid] = { id: uid, data, rules, position, status, dataVersion };
      return acc;
    }, {});

  return {
    meta: getPageMeta({ page }),
    blocks: await getPageBlocks({
      page,
      project,
      globalBlocks,
      googleFonts,
      buildPath
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

async function getPageBlocks({
  page,
  project: _project,
  globalBlocks,
  googleFonts,
  buildPath
}) {
  const store = createStore();
  const project = parseProject(_project);
  const { fonts, font: projectDefaultFont } = project.data;

  const blocks = getBlocksInPage(page, globalBlocks);

  // NEW FONTS FOUND
  // some fonts are found in models
  // that are not present in project
  // we need to find them in google
  // and add them to the project
  const parsedFonts = parseFonts(blocks, project);
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
      projectStatus: {}
    })
  );

  const { Page, PagePopup } = EditorGlobal.getComponents();
  const reduxState = store.getState();

  // === TMP ===
  css.isServer = true;
  // ===========

  const dbValue = pageDataDraftBlocksSelector(reduxState);
  const { html, css: glamorCSS } = renderStatic(() =>
    ReactDOMServer.renderToStaticMarkup(
      <Provider store={store}>
        {IS_GLOBAL_POPUP ? (
          <PagePopup dbValue={dbValue} reduxState={reduxState} />
        ) : (
          <Page dbValue={dbValue} reduxState={reduxState} />
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
  await replaceIcons($pageHTML, buildPath);
  changeRichText($pageHTML);

  const { freeScripts, freeStyles, proScripts, proStyles } = getAssets(
    $pageHTML,
    fontMap
  );

  // at the moment extractPopups MUST come after getAssets
  // because extractPopups expects a certain html structure that
  // becomes true only after getAssets is executed
  extractPopups($pageHTML);
  const head = $pageHTML("head").html();
  const body = dynamicContent($pageHTML("body").html());

  return {
    freeStyles,
    freeScripts,
    proStyles,
    proScripts,
    head,
    body
  };
}

/**
 * parseFonts() returns arrays of fonts
 * used in page and project [{ family: "lato", type: "google" }]
 */
function parseFonts(blocks, project) {
  if (parseFonts.cache) {
    return parseFonts.cache;
  }

  // get fonts from page
  const pageFonts = getUsedModelsFonts({
    models: blocks
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
