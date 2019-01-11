import "./webpack-public-path";

import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { getPages, addPage, getGlobals } from "visual/utils/api/editor";
import { makePageData } from "visual/utils/pages";
import { applyAsyncFilter } from "visual/utils/filters";

import { createStore } from "visual/redux/store";
import middleware from "./middleware";
import { hydrate, editorRendered } from "visual/redux/actionCreators";

import Editor from "visual/component/Editor";
import "../registerEditorParts";

import "visual/experimental/screenshots";

const appDiv = document.querySelector("#brz-ed-root");
const pageCurtain = window.parent.document.querySelector(
  ".brz-ed-page-curtain"
);

Promise.resolve()
  .then(() => {
    if (!appDiv) {
      pageCurtain.classList.add("has-load-error");
      throw new Error("could not find #brz-ed-root");
    }
  })
  .then(() => {
    // start fetching data needed for the render
    return Promise.all([getPages(), getGlobals()]).then(([pages, globals]) => {
      if (pages.length === 0) {
        // must create the index page
        const indexPageData = makePageData({ title: "Home", index: true });
        const indexPagePromise = addPage(indexPageData).then(r => [r]);

        return Promise.all([indexPagePromise, globals]);
      } else {
        // index page exists
        return [pages, globals];
      }
    });
  })
  .then(async ([pages, globals]) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Pages loaded", pages);
      console.log("Globals loaded", globals);
    }

    const store = createStore({
      middleware: await applyAsyncFilter(
        "bootstraps.editor.middleware",
        middleware
      )
    });

    const indexPage = pages.find(page => page.index);
    store.dispatch(hydrate({ page: indexPage, globals }));

    return store;
  })
  .then(store => {
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
  })
  .catch(e => {
    console.error("Editor Bootstraps error", e);
  });
