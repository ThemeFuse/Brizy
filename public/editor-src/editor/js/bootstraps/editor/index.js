import "./webpack-public-path";

import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import Config from "visual/global/Config";

import {
  getPages,
  createPage,
  getGlobals,
  getGlobalBlocks,
  getSavedBlocks
} from "visual/utils/api/editor";
import { applyAsyncFilter } from "visual/utils/filters";

import { createStore } from "visual/redux/store";
import middleware from "./middleware";
import { hydrate, editorRendered } from "visual/redux/actions";

import Editor from "visual/component/Editor";
import "../registerEditorParts";

import "visual/experimental/screenshots";

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

    const [pages, globals, globalBlocks, savedBlocks] = await Promise.all([
      getPages(),
      getGlobals(),
      getGlobalBlocks(),
      getSavedBlocks()
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

    if (process.env.NODE_ENV === "development") {
      console.log("Pages loaded", pages);
      console.log("Globals loaded", globals);
      console.log("Global blocks loaded", globalBlocks);
      console.log("Saved blocks loaded", savedBlocks);
    }

    const store = createStore({
      middleware: await applyAsyncFilter(
        "bootstraps.editor.middleware",
        middleware
      )
    });

    const indexPage = pages.find(page => page.is_index);
    store.dispatch(
      hydrate({ page: indexPage, globals, globalBlocks, savedBlocks })
    );

    // if (process.env.NODE_ENV === "development") {
    global.brzStore = store; // think about putting it in development mode later
    // }

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
    console.error("editor bootstrap error", e);
  }
})();
