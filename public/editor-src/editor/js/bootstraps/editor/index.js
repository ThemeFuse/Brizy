import deepMerge from "deepmerge";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Editor from "visual/component/Editor";
import Config from "visual/global/Config";
import { editorRendered, hydrate } from "visual/redux/actions";
import { pageSelector, projectSelector } from "visual/redux/selectors";
import { createStore } from "visual/redux/store";
import {
  addProjectLockedBeacon,
  getGlobalBlocks,
  removeProjectLockedSendBeacon
} from "visual/utils/api";
import { AuthProvider } from "visual/utils/api/providers/Auth";
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
import "../registerEditorParts";
import { getCurrentPage } from "./getCurrentPage";
import getMiddleware from "./middleware";
import { showError } from "./utils/errors";

const appDiv = document.querySelector("#brz-ed-root");
const pageCurtain = window.parent.document.querySelector(
  ".brz-ed-page-curtain"
);

(async function main() {
  try {
    if (!appDiv) {
      pageCurtain?.classList.add("has-load-error");
      throw new PageError(t("could not find #brz-ed-root"));
    }

    const config = Config.getAll();
    const projectStatus = config.project.status || {};
    const project = config.projectData;
    const { isSyncAllowed = false } = config.cloud || {};

    if (!project || !project.data) {
      throw new ProjectError(t("missing project"));
    }

    if (projectStatus && !projectStatus.locked) {
      await addProjectLockedBeacon();
    }

    const [currentPage, globalBlocks] = await Promise.all([
      getCurrentPage(config),
      getGlobalBlocks()
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

    config.onUpdate = (res) => {
      store.dispatch({
        type: "PUBLISH",
        payload: {
          status: store.getState().page.status
        },
        meta: {
          onSuccess: () => {
            (async () => {
              try {
                const state = store.getState();
                const pageData = pageSelector(state);
                const projectData = projectSelector(state);
                let pageHTML = {};

                if (IS_EXPORT) {
                  try {
                    if (AUTHORIZATION_URL) {
                      const Auth = new AuthProvider(AUTHORIZATION_URL);
                      await Auth.send();
                    }
                  } catch (e) {
                    console.warn("Compile without export");
                  }
                }

                res({ ...pageHTML, pageData, projectData });
              } catch (e) {
                showError(e);
              }
            })();
          }
        }
      });
    };

    ReactDOM.render(
      <Provider store={store}>
        <Editor />
      </Provider>,
      appDiv,
      () => {
        pageCurtain?.parentElement.removeChild(pageCurtain);

        store.dispatch(editorRendered());

        if (typeof config.onLoad === "function") {
          config.onLoad();
        }
      }
    );
  } catch (e) {
    showError(e, 0);
  }
})();
