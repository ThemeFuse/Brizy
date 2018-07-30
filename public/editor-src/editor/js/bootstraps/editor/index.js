import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { getPages, addPage, getGlobals } from "visual/utils/api/editor";
import { makePageData } from "visual/utils/pages";

import { createStore } from "visual/redux/store";
import thunk from "redux-thunk";
import { api, sideEffects } from "visual/redux/middleware";
import { hydrate } from "visual/redux/actionCreators";

import styles from "visual-template/styles/default";

import Editor from "visual/component-new/Editor";
import "../registerEditorParts";

const appDiv = document.querySelector("#brz-ed-root");

Promise.resolve()
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
  .then(([pages, globals]) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Pages loaded", pages);
      console.log("Globals loaded", globals);
    }

    const indexPage = pages.find(page => page.index);
    const store = createStore({
      middleware: [
        thunk,
        api,
        sideEffects({ document, parentDocument: window.parent.document })
      ]
    });
    store.dispatch(hydrate({ page: indexPage, globals, styles }));

    // if (process.env.NODE_ENV === "development") {
    global.brzStore = store; // think about putting it in development mode later
    // }

    ReactDOM.render(
      <Provider store={store}>
        <Editor />
      </Provider>,
      appDiv,
      () => {
        appDiv.setAttribute("data-rendered", true);
        appDiv.dispatchEvent(new Event("brz.render"));
      }
    );
  })
  .catch(e => {
    console.error("Editor Bootstraps error", e);
  });
