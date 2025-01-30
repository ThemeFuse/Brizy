import { Obj } from "@brizy/readers";
import deepMerge from "deepmerge";
import React from "react";
import { createRoot } from "react-dom/client";
import { omit } from "timm";
import { Editor } from "visual/bootstraps/module/Editor";
import { Project } from "visual/types/Project";
import { flatMap } from "visual/utils/array";
import { getBlocksInPage } from "visual/utils/blocks";
import { ConfigError, PageError, ProjectError } from "visual/utils/errors";
import { normalizeAdobeFonts } from "visual/utils/fonts/getAdobeFonts";
import { normalizeFonts } from "visual/utils/fonts/normalizeFonts";
import { normalizeStyles } from "visual/utils/fonts/transform";
import { systemFont } from "visual/utils/fonts/utils";
import { I18n, t } from "visual/utils/i18n";
import { parseGlobalBlocksToRecord } from "visual/utils/reader/globalBlocks";
import {
  getBlocksStylesFonts,
  getUsedModelsFonts,
  getUsedStylesFonts
} from "visual/utils/traverse";
import { readConfig } from "../initConfig/readConfig";
import { showError } from "./utils/errors";
import { normalizePage } from "./utils/normalizePage";

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
    if (!appDiv) {
      pageCurtain?.classList.add("has-load-error");
      throw new PageError(t("could not find #brz-ed-root"));
    }

    // @ts-expect-error: __VISUAL_CONFIG__
    const config = readConfig(global.__VISUAL_CONFIG__);

    if (!config) {
      throw new ConfigError(t("Invalid editor config"));
    }

    const project = config.projectData;
    const page = config.pageData;
    const editorMode = config.mode;

    if (!project || !project.data) {
      throw new ProjectError(t("Missing project data in config"));
    }

    if (!page || !page.data) {
      throw new PageError(t("Missing page data in config"));
    }

    const globalBlocks = parseGlobalBlocksToRecord(config.globalBlocks) ?? {};

    // NEW FONTS FOUND
    // some fonts are found in models
    // that are not present in project
    // we need to find them in google
    // and add them to the project
    const { styles, extraFontStyles = [], fonts } = project.data;
    const blocks = getBlocksInPage({ page, globalBlocks, config });

    const pageFonts = getUsedModelsFonts({
      models: blocks,
      globalBlocks: globalBlocks
    });
    const fontStyles = flatMap(styles, ({ fontStyles }) => fontStyles);
    const stylesFonts = getUsedStylesFonts([...fontStyles, ...extraFontStyles]);
    const adobeFonts = fonts.adobe?.id
      ? await normalizeAdobeFonts(config.api, fonts.adobe.id)
      : {};
    const fontsDiff = await normalizeFonts({
      config,
      renderContext: "editor",
      newFonts: getBlocksStylesFonts([...pageFonts, ...stylesFonts], {
        ...fonts,
        ...adobeFonts
      })
    });
    const newFonts = fontsDiff.reduce(
      (acc, { type, fonts }) => ({ ...acc, [type]: { data: fonts } }),
      {}
    );

    const normalizedProject: Project = {
      ...project,
      data: {
        ...project.data,
        // @ts-expect-error: Need to transform to TS
        styles: normalizeStyles(styles),
        fonts: deepMerge.all([{ ...fonts, ..._systemFont }, newFonts])
      }
    };

    const newConfig = {
      ...config,
      projectData: normalizedProject,
      pageData: normalizePage(page, editorMode),
      onLoad() {
        config.onLoad?.();
        pageCurtain?.parentElement?.removeChild(pageCurtain);
      }
    };

    const i18n = I18n.init({
      // @ts-expect-error: Removed l10n from ConfigCommon
      resources: Obj.readNoArray(config.l10n) ? config.l10n : {}
    });

    const app = (
      <Editor
        i18n={i18n}
        config={omit(newConfig, ["l10n"])}
        editorMode={editorMode}
      />
    );
    const root = createRoot(appDiv);

    root.render(app);
  } catch (e) {
    if (pageCurtain) {
      showError({ e, inRoot: true, hideAfter: 0 });
    }
  }
})();
