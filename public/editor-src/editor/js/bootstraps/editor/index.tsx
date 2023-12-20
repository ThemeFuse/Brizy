import deepMerge from "deepmerge";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Editor from "visual/component/Editor";
import Config from "visual/global/Config";
import { editorRendered, hydrate } from "visual/redux/actions";
import { createStore } from "visual/redux/store";
import { Font } from "visual/types";
import {
  addProjectLockedBeacon,
  getGlobalBlocks,
  removeProjectLockedSendBeacon
} from "visual/utils/api";
import { flatMap } from "visual/utils/array";
import { getBlocksInPage } from "visual/utils/blocks";
import { PageError, ProjectError } from "visual/utils/errors";
import { normalizeFonts, normalizeStyles } from "visual/utils/fonts";
import { t } from "visual/utils/i18n";
import {
  getBlocksStylesFonts,
  getUsedModelsFonts,
  getUsedStylesFonts
} from "visual/utils/traverse";
import { getAuthorized } from "visual/utils/user/getAuthorized";
import { systemFont } from "../../utils/fonts/utils";
import getMiddleware from "./middleware";
import { readPageData } from "./utils/adapter";
import { showError } from "./utils/errors";

const appDiv = document.querySelector("#brz-ed-root");
const pageCurtain = window.parent.document.querySelector<HTMLElement>(
  ".brz-ed-page-curtain"
);

const _systemFont = {
  system: {
    data: systemFont
  }
};

(async function main() {
  try {
    if (!appDiv && pageCurtain) {
      pageCurtain?.classList.add("has-load-error");
      throw new PageError(t("could not find #brz-ed-root"));
    }

    const config = Config.getAll();
    const projectStatus = config.project.status;
    const project = config.projectData;
    const _page = config.pageData;

    const { isSyncAllowed = false } = config.cloud || {};

    if (!project || !project.data) {
      throw new ProjectError(t("Missing project data in config"));
    }

    if (!_page || !_page.data) {
      throw new PageError(t("Missing page data in config"));
    }

    if (projectStatus && !projectStatus.locked) {
      await addProjectLockedBeacon();
    }

    const page = readPageData(_page);
    const globalBlocks = await getGlobalBlocks();

    /* eslint-disable no-console */
    if (process.env.NODE_ENV === "development") {
      console.log("Project loaded", project);
      console.log("Page loaded", page);
      console.log("Global blocks loaded", globalBlocks);
    }
    /* eslint-enabled no-console */

    // NEW FONTS FOUND
    // some fonts are found in models
    // that are not present in project
    // we need to find them in google
    // and add them to the project
    const { styles, extraFontStyles = [], fonts } = project.data;

    const blocks = getBlocksInPage(page, globalBlocks);

    const pageFonts = getUsedModelsFonts({
      models: blocks,
      globalBlocks: globalBlocks
    });
    const fontStyles = flatMap(styles, ({ fontStyles }) => fontStyles);
    const stylesFonts = getUsedStylesFonts([...fontStyles, ...extraFontStyles]);
    const fontsDiff: Array<{ type: "blocks" | "upload"; fonts: Array<Font> }> =
      await normalizeFonts(
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
      // @ts-expect-error: to ts
      hydrate({
        project: normalizedProject,
        projectStatus,
        page,
        globalBlocks,
        authorized: getAuthorized(),
        syncAllowed: isSyncAllowed,
        fonts: deepMerge.all([fonts, newFonts, _systemFont])
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

    // For External API
    config.onUpdate = (res) => {
      store.dispatch({
        type: "PUBLISH",
        payload: {
          status: store.getState().page.status,
          type: "external",
          res
        }
      });
    };

    ReactDOM.render(
      <Provider store={store}>
        <Editor />
      </Provider>,
      appDiv,
      () => {
        pageCurtain?.parentElement?.removeChild(pageCurtain);

        // @ts-expect-error to TS
        store.dispatch(editorRendered());

        if (typeof config.onLoad === "function") {
          config.onLoad();
        }
      }
    );
  } catch (e) {
    if (pageCurtain) {
      showError({ e, inRoot: true, hideAfter: 0 });
    }
  }
})();
