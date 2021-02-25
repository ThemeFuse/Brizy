import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import deepMerge from "deepmerge";

import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";

import { getCurrentPage } from "./getCurrentPage";
import {
  getProject,
  getGlobalBlocks,
  removeProjectLockedSendBeacon,
  addProjectLockedBeacon
} from "visual/utils/api";
import { assetUrl } from "visual/utils/asset";
import { getBlocksInPage } from "visual/utils/blocks";

import {
  getUsedModelsFonts,
  getUsedStylesFonts,
  getBlocksStylesFonts
} from "visual/utils/traverse";
import { normalizeFonts, normalizeStyles } from "visual/utils/fonts";
import { flatMap } from "visual/utils/array";
import { CustomError, PageError } from "visual/utils/errors";

import { createStore } from "visual/redux/store";
import getMiddleware from "./middleware";
import { hydrate, editorRendered } from "visual/redux/actions";
import { getAuthorized } from "visual/utils/user/getAuthorized";

import Editor from "visual/component/Editor";
import { ToastNotification } from "visual/component/Notifications";

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
    const { isSyncAllowed = false } = Config.get("cloud") || {};
    if (projectStatus && !projectStatus.locked) {
      await addProjectLockedBeacon();
    }

    const [
      project,
      currentPage,
      globalBlocks,
      blocksThumbnailSizes
    ] = await Promise.all([
      getProject(),
      getCurrentPage(),
      getGlobalBlocks(),
      fetch(assetUrl("thumbs/blocksThumbnailSizes.json")).then(r => r.json())
    ]);

    /* eslint-disable no-console */
    if (process.env.NODE_ENV === "development") {
      console.log("Project loaded", project);
      console.log("currentPage loaded", currentPage);
      console.log("Global blocks loaded", globalBlocks);
    }
    /* eslint-enabled no-console */

    // NEW FONTS FOUND
    // some fonts are found in models
    // that are not present in project
    // we need to find them in google
    // and add them to the project
    const { styles, extraFontStyles = [], fonts } = project.data;

    const blocks = getBlocksInPage(currentPage, globalBlocks);

    const pageFonts = getUsedModelsFonts({
      models: blocks,
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

    const normalizedProject = {
      ...project,
      data: {
        ...project.data,
        styles: normalizeStyles(styles)
      }
    };

    const store = createStore({
      middleware: await getMiddleware()
    });

    store.dispatch(
      hydrate({
        project: normalizedProject,
        projectStatus,
        globalBlocks,
        blocksThumbnailSizes,
        authorized: getAuthorized(),
        syncAllowed: isSyncAllowed,
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

    const message =
      isCustomError && e.getMessage()
        ? e.getMessage()
        : t("Something went wrong");

    ToastNotification.error(message, {
      hideAfter: 0,
      toastContainer: pageCurtain
    });
  }
})();
