import "babel-polyfill";

import React from "react";
import ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import { renderStatic } from "glamor/server";
import cheerio from "cheerio";

import { converter } from "visual/utils/api/editor";

import { createStore } from "visual/redux/store";
import { hydrate } from "visual/redux/actionCreators";
import styles from "visual-template/styles/default";

import EditorGlobal from "visual/global/Editor";
import "../registerEditorParts";

import addFonts from "./transforms/head/addFonts";
import addColorPaletteCSS from "./transforms/head/addColorPaletteCSS";
import addFontStylesCSS from "./transforms/head/addFontStylesCSS";
import addGlamorCSS from "./transforms/head/addGlamorCSS";
import changeRichTextLinks from "./transforms/body/changeRichTextLinks";

export default function main(pageId, pages, globals) {
  const convertedPages = pages.map(converter.pageFromBackend);
  const page = convertedPages.find(
    page => (pageId ? page.id === pageId : page.index)
  );

  if (!page) {
    throw new Error(`can not find page with id ${pageId}`);
  }

  return {
    meta: getPageMeta(page),
    blocks: getPageBlocks(page, globals)
  };
}

function getPageMeta(page) {
  return {
    slug: page.slug || "",
    title: page.title || "",
    description: page.description || ""
  };
}

function getPageBlocks(page, globals) {
  const store = createStore();

  store.dispatch(hydrate({ page, globals, styles }));

  const { Page } = EditorGlobal.getComponents();
  const reduxState = store.getState();
  const { html, css: glamorCSS } = renderStatic(() =>
    ReactDOMServer.renderToStaticMarkup(
      <Provider store={store}>
        <Page dbValue={reduxState.page.data} reduxState={reduxState} />
      </Provider>
    )
  );

  const $pageHTML = cheerio.load(html);

  return {
    head: getPageHeadBlock($pageHTML, glamorCSS),
    body: getPageBodyBlock($pageHTML)
  };
}

function getPageHeadBlock($pageHTML, glamorCSS) {
  const $ = cheerio.load("<head></head>");
  const $head = $("head");

  addFonts($head);
  addColorPaletteCSS($head);
  addFontStylesCSS($head);
  addGlamorCSS($head, glamorCSS);

  // transformMetaShare($head, $pageHTML);
  // transformColorScheme($head, $pageHTML);
  // transformGridScheme($head, $pageHTML);
  // transformUserStyles($head, $pageHTML);
  // transformUserScripts($head, $pageHTML);
  // transformHoverButtonStyles($head, $pageHTML);
  // transformSeo($head, $pageHTML);

  return $head.html();
}

function getPageBodyBlock($pageHTML) {
  // transformNoscriptTags($pageHTML);
  // transformInternalLinks($pageHTML);
  // transformUnusedPopups($pageHTML);
  // transformDeletedClassNames($pageHTML);
  // if (Config.get("blurImages")) {
  //   transformBlurredImages($pageHTML);
  // }
  changeRichTextLinks($pageHTML);

  return $pageHTML.html();
}
