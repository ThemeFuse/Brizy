import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import deepMerge from "deepmerge";
import Config from "visual/global/Config";

import {
  getProject,
  getGlobalBlocks,
  getSavedBlocks,
  removeProjectLockedSendBeacon,
  addProjectLockedBeacon
} from "visual/utils/api/editor";
import { assetUrl } from "visual/utils/asset";

import {
  getUsedModelsFonts,
  getUsedStylesFonts,
  getBlocksStylesFonts
} from "visual/utils/traverse";
import { normalizeFonts } from "visual/utils/fonts";
import { flatMap } from "visual/utils/array";
import { CustomError, PageError } from "visual/utils/errors";

import { createStore } from "visual/redux/store";
import getMiddleware from "./middleware";
import { hydrate, editorRendered } from "visual/redux/actions";
import { t } from "visual/utils/i18n";

import Editor from "visual/component/Editor";
import { ToastNotification } from "visual/component/Notifications";
import { getCurrentPage } from "./getCurrentPage";
import "../registerEditorParts";

const appDiv = document.querySelector("#brz-ed-root");
const pageCurtain = window.parent.document.querySelector(
  ".brz-ed-page-curtain"
);

(async function main() {
  try {
    if (!appDiv) {
      pageCurtain.classList.add("has-load-error");
      throw new PageError("could not find #brz-ed-root");
    }

    const projectStatus = Config.get("project").status || {};

    if (projectStatus && !projectStatus.locked) {
      await addProjectLockedBeacon();
    }

    const [
      project,
      currentPage,
      globalBlocks,
      savedBlocks,
      blocksThumbnailSizes
    ] = await Promise.all([
      getProject(),
      getCurrentPage(),
      getGlobalBlocks(),
      getSavedBlocks(),
      fetch(assetUrl("thumbs/blocksThumbnailSizes.json")).then(r => r.json())
    ]);

    /* eslint-disable no-console */
    if (process.env.NODE_ENV === "development") {
      console.log("Project loaded", project);
      console.log("currentPage loaded", currentPage);
      console.log("Global blocks loaded", globalBlocks);
      console.log("Saved blocks loaded", savedBlocks);
    }
    /* eslint-enabled no-console */

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
        projectStatus,
        globalBlocks,
        savedBlocks,
        blocksThumbnailSizes,
        fonts: deepMerge(fonts, newFonts),
        page: currentPage
      })
    );

    // think about putting it only in development mode later
    if (IS_EDITOR) {
      window.brzStore = store;
      window.parent.brzStore = store;

      // beacon send data
      window.parent.addEventListener(
        "unload",
        removeProjectLockedSendBeacon,
        false
      );
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
    const isCustomError = e instanceof CustomError;

    /* eslint-disable no-console */
    if (isCustomError) {
      console.error("editor bootstrap error", e.getMessage());
    } else {
      console.error("editor bootstrap error", e);
    }
    /* eslint-enabled no-console */

    const message = isCustomError
      ? `${t("Something went wrong with the")} ${e.getName()}`
      : t("Something went wrong");

    ToastNotification.error(message, {
      hideAfter: 0,
      toastContainer: pageCurtain
    });
  }
})();
