import cheerio from "cheerio";
import deepMerge from "deepmerge";
// @ts-expect-error: Missing types for glamor/server
import { renderStatic } from "glamor/server";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import {
  ScriptsFree,
  ScriptsPro,
  StylesFree,
  StylesPro,
  getAssets
} from "visual/bootstraps/export/transforms/assets";
import googleFonts from "visual/config/googleFonts.json";
import Config from "visual/global/Config";
import EditorGlobal from "visual/global/Editor";
import { hydrate } from "visual/redux/actions";
import {
  fontsSelector,
  getDefaultFontDetailsSelector,
  pageDataDraftBlocksSelector
} from "visual/redux/selectors";
import { createStore } from "visual/redux/store";
import { GlobalBlock, GoogleFont, PageCommon, Project } from "visual/types";
import { getBlocksInPage } from "visual/utils/blocks";
import { css, tmpCSSFromCache } from "visual/utils/cssStyle";
import { findFonts } from "visual/utils/fonts";
import { systemFont } from "visual/utils/fonts/utils";
import { isPopup, isStory } from "visual/utils/models";
import { getBlocksStylesFonts } from "visual/utils/traverse";
import { MValue } from "visual/utils/value";
import "../../../registerEditorParts";
import { changeMenuUid } from "../transforms/changeMenuUid";
import { changeRichText } from "../transforms/changeRichText";
import { customAttributes } from "../transforms/customAttributes";
import { dynamicContent } from "../transforms/dynamicContent";
import { extractPopups } from "../transforms/extractPopups";
import { replaceIcons } from "../transforms/replaceIcons";
import { XSS } from "../transforms/xss";
import { getUsedFonts } from "../utils/getUsedFonts";
import { parseFonts } from "../utils/parseFonts";

interface Props {
  page: PageCommon;
  project: Project;
  globalBlocks?: Array<GlobalBlock>;
}

export interface Output {
  html: string;
  assets: {
    freeStyles: StylesFree;
    freeScripts: ScriptsFree;
    proStyles?: StylesPro;
    proScripts?: ScriptsPro;
  };
}

export type SSREditor = (p: Props) => Promise<MValue<Output>>;

export const Editor: SSREditor = async (props) => {
  const { page, project } = props;
  const { fonts, font: projectDefaultFontId } = project.data;
  const store = createStore();
  const config = Config.getAll();
  const globalBlocks = {};

  const blocks = getBlocksInPage(page, globalBlocks);

  // NEW FONTS FOUND
  // some fonts are found in models
  // that are not present in project
  // we need to find them in google
  // and add them to the project
  const parsedFonts = parseFonts(blocks, project);
  const blocksFonts: Array<GoogleFont> = [];

  getBlocksStylesFonts(parsedFonts, fonts).forEach(({ type, family }) => {
    if (type === "google" || type === "unknowns") {
      const font = findFonts(googleFonts.items, family);

      if (font) {
        blocksFonts.push(font);
      }
    }
  });

  const _fonts = deepMerge(fonts, {
    blocks: { data: blocksFonts },
    system: {
      data: systemFont
    }
  });

  store.dispatch(
    //@ts-expect-error: To Ts
    hydrate({
      page,
      project,
      fonts: _fonts,
      globalBlocks,
      projectStatus: {}
    })
  );

  const { Page, PagePopup, PageStory } = EditorGlobal.getComponents();
  const reduxState = store.getState();

  // @ts-expect-error: === TMP SSR ===
  css.isServer = true;
  // ===========

  const dbValue = pageDataDraftBlocksSelector(reduxState);

  if (!Page || !PagePopup || !PageStory) {
    console.log("Missing Page Components", EditorGlobal.getComponents());
    return;
  }
  const pageProps = {
    dbValue,
    reduxState,
    className: "brz"
  };

  const { html, css: glamorCSS } = renderStatic(() =>
    ReactDOMServer.renderToStaticMarkup(
      <Provider store={store}>
        {isPopup(config) ? (
          // @ts-expect-error PagePopup
          <PagePopup {...pageProps} />
        ) : isStory(config) ? (
          // @ts-expect-error PageStory
          <PageStory {...pageProps} />
        ) : (
          // @ts-expect-error Page
          <Page {...pageProps} />
        )}
      </Provider>
    )
  );

  // === TMP ===
  const brzCss = tmpCSSFromCache();
  // ===========

  const $pageHTML = cheerio.load(
    `<html>
      <head>
        <style class="brz-style">${glamorCSS}</style>
        <style class="brz-style">${brzCss}</style>
      </head>
      <body>${html}</body>
    </html>`,
    // was added because of this issue
    // https://github.com/bagrinsergiu/blox-editor/issues/13929
    { decodeEntities: false }
  );

  //#region Transforms

  await replaceIcons($pageHTML);
  changeRichText($pageHTML);
  changeMenuUid($pageHTML);
  customAttributes($pageHTML);

  if (!config.user.allowScripts) {
    XSS($pageHTML);
  }

  //#endregion

  //#region Assets

  const usedFonts = getUsedFonts({
    projectDefaultFontId,
    parsedFonts,
    fonts: fontsSelector(reduxState),
    defaultFont: getDefaultFontDetailsSelector(reduxState)
  });

  const { freeScripts, freeStyles, proScripts, proStyles } = getAssets(
    $pageHTML,
    usedFonts
  );

  //#endregion

  // at the moment extractPopups MUST come after getAssets
  // because extractPopups expects a certain html structure that
  // becomes true only after getAssets is executed
  extractPopups($pageHTML);
  const body = dynamicContent($pageHTML("body").html() ?? "");

  return {
    html: body,
    assets: {
      freeScripts,
      freeStyles,
      proScripts,
      proStyles
    }
  };
};
