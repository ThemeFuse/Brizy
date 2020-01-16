import "./webpack-public-path";

import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import deepMerge from "deepmerge";

import Config from "visual/global/Config";

import {
  getProject,
  getPages,
  createPage,
  getGlobalBlocks,
  getSavedBlocks
} from "visual/utils/api/editor";
import { assetUrl } from "visual/utils/asset";

import {
  getUsedModelsFonts,
  getUsedStylesFonts,
  getBlocksStylesFonts
} from "visual/utils/traverse";
import { normalizeFonts } from "visual/utils/fonts";
import { flatMap } from "visual/utils/array";

import { createStore } from "visual/redux/store";
import getMiddleware from "./middleware";
import { hydrate, editorRendered } from "visual/redux/actions";

import Editor from "visual/component/Editor";
import "../registerEditorParts";

const appDiv = document.querySelector("#brz-ed-root");
const pageCurtain = window.parent.document.querySelector(
  ".brz-ed-page-curtain"
);

(async function main() {
  try {
    if (!appDiv) {
      pageCurtain.classList.add("has-load-error");
      throw new Error("could not find #brz-ed-root");
    }

    const [
      project,
      pages,
      globalBlocks,
      savedBlocks,
      blocksThumbnailSizes
    ] = await Promise.all([
      getProject(),
      getPages(),
      getGlobalBlocks(),
      getSavedBlocks(),
      fetch(assetUrl("thumbs/blocksThumbnailSizes.json")).then(r => r.json())
    ]);

    // create the index page when api returns no pages
    // this should never happen in WP,
    // the TARGET check is put here just in case
    if (pages.length === 0 && TARGET !== "WP") {
      const indexPageData = {
        project: Config.get("project").id,
        data: null,
        is_index: true,
        status: "draft"
      };
      const meta = { is_autosave: 0 };
      let indexPage;

      try {
        indexPage = await createPage(indexPageData, meta);
        pages.push(indexPage);
      } catch (e) {
        throw `Could not create index page ${e}`;
      }
    }

    /* eslint-disable no-console */
    if (process.env.NODE_ENV === "development") {
      console.log("Project loaded", project);
      console.log("Pages loaded", pages);
      console.log("Global blocks loaded", globalBlocks);
      console.log("Saved blocks loaded", savedBlocks);
    }
    /* eslint-enabled no-console */

    const configPageId = Config.get("page") && Config.get("page").id;
    const currentPage = configPageId
      ? pages.find(page => page.id === configPageId)
      : pages.find(page => page.is_index);

    // NEW FONTS FOUND
    // some fonts are found in models
    // that are not present in project
    // we need to find them in google
    // and add them to the project
    const { styles, extraFontStyles = [], fonts } = project.data;
    const pageFonts = getUsedModelsFonts({
      models: currentPage.data,
      globalBlocks
    });
    const fontStyles = flatMap(styles, ({ fontStyles }) => fontStyles);
    const stylesFonts = getUsedStylesFonts([...fontStyles, ...extraFontStyles]);
    const fontsDiff = await normalizeFonts(
      getBlocksStylesFonts([...pageFonts, ...stylesFonts], fonts)
    );
    const newFonts = fontsDiff.reduce(
      (acc, { type, fonts }) => ({ ...acc, [type]: { data: fonts } }),
      {}
    );

    const store = createStore({
      middleware: await getMiddleware()
    });

    store.dispatch(
      hydrate({
        project,
        fonts: deepMerge(fonts, newFonts),
        page: currentPage,
        globalBlocks,
        savedBlocks,
        blocksThumbnailSizes
      })
    );

    // think about putting it only in development mode later
    if (IS_EDITOR) {
      window.brzStore = store;
      window.parent.brzStore = store;
    }

    ReactDOM.render(
      <Provider store={store}>
        <Editor />
      </Provider>,
      appDiv,
      () => {
        pageCurtain.parentElement.removeChild(pageCurtain);

        store.dispatch(editorRendered());
      }
    );
  } catch (e) {
    /* eslint-disable no-console */
    console.error("editor bootstrap error", e);
    /* eslint-enabled no-console */
  }
})();
