import "@babel/polyfill";

import React from "react";
import ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import { renderStatic } from "glamor/server";
import cheerio from "cheerio";

import { parsePage } from "visual/utils/api/editor/adapter";

import { createStore } from "visual/redux/store";
import { hydrate } from "visual/redux/actions";

import EditorGlobal from "visual/global/Editor";
import "../registerEditorParts";

import addFonts from "./transforms/head/addFonts";
import addColorPaletteCSS from "./transforms/head/addColorPaletteCSS";
import addFontStylesCSS from "./transforms/head/addFontStylesCSS";
import addCustomCSS from "./transforms/head/addCustomCSS";
import changeRichText from "./transforms/body/changeRichText";
import changeRichTextDCColor from "./transforms/body/changeRichTextDCColor";

export default function main(pageId, pages, globals) {
  const page = pages
    .map(parsePage)
    .find(page => (pageId ? page.id === pageId : page.is_index));

  // this is done to keep the compiler backwards compatible
  // with the times when Global and Saved blocks were saved inside globals.
  // Doing so prevents older version to crash the compiler
  const { globalBlocks = {}, savedBlocks = {} } = globals;
  delete globals.globalBlocks;
  delete globals.savedBlocks;

  if (!page) {
    throw new Error(`can not find page with id ${pageId}`);
  }

  return {
    meta: getPageMeta({ page }),
    blocks: getPageBlocks({ page, globals, globalBlocks, savedBlocks })
  };
}

function getPageMeta({ page }) {
  return {
    slug: page.slug || "",
    title: page.title || "",
    description: page.description || ""
  };
}

function getPageBlocks({ page, globals, globalBlocks, savedBlocks }) {
  const store = createStore();

  store.dispatch(hydrate({ page, globals, globalBlocks, savedBlocks }));

  const { Page } = EditorGlobal.getComponents();
  const reduxState = store.getState();
  const { html, css: glamorCSS } = renderStatic(() =>
    ReactDOMServer.renderToStaticMarkup(
      <Provider store={store}>
        <Page dbValue={reduxState.page.data} reduxState={reduxState} />
      </Provider>
    )
  );

  const $pageHTML = cheerio.load(
    `<html><head><style>${glamorCSS}</style></head><body>${html}</body></html>`
  );

  changeRichTextDCColor($pageHTML);

  return {
    head: getPageHeadBlock($pageHTML),
    body: getPageBodyBlock($pageHTML)
  };
}

function getPageHeadBlock($pageHTML) {
  addColorPaletteCSS($pageHTML);
  addFontStylesCSS($pageHTML);
  addFonts($pageHTML);
  addCustomCSS($pageHTML);

  return $pageHTML("head").html();
}

function getPageBodyBlock($pageHTML) {
  changeRichText($pageHTML);

  return $pageHTML("body").html();
}
