import cheerio from "cheerio";
// @ts-expect-error: Missing types for glamor/server
import { renderStatic } from "glamor/server";
import React, { ReactElement } from "react";
import ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  defaultFontSelector,
  fontsSelector,
  getDefaultFontDetailsSelector
} from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import {
  clearCache as clearCSSCache,
  css,
  tmpCSSFromCache
} from "visual/utils/cssStyle";
import {
  clearFamilyCache,
  getUsedModelFontFamily
} from "visual/utils/options/getDetailsModelFontFamily";
import { getAssets } from "../transforms/assets";
import { changeMenuUid } from "../transforms/changeMenuUid";
import { changeRichText } from "../transforms/changeRichText";
import { customAttributes } from "../transforms/customAttributes";
import { dynamicContent } from "../transforms/dynamicContent";
import { XSS } from "../transforms/xss";
import { getUsedFonts } from "../utils/getUsedFonts";
import { Output } from "./types";

interface Props {
  store: Store;
  config: ConfigCommon;
  Page: ReactElement;
}

export const baseToStatic = async (props: Props): Promise<Output> => {
  const { store, config, Page } = props;
  const reduxState = store.getState();
  const projectDefaultFontId = defaultFontSelector(reduxState);

  // @ts-expect-error: === TMP SSR ===
  css.isServer = true;
  // ===========

  // Clear all css before execute
  clearCSSCache();

  // Clear all extracted FontFamilies
  clearFamilyCache();

  const { html, css: glamorCSS } = renderStatic(() =>
    ReactDOMServer.renderToStaticMarkup(
      <Provider store={store}>{Page}</Provider>
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

  changeRichText($pageHTML);
  changeMenuUid($pageHTML);
  customAttributes($pageHTML);

  if (!config.user.allowScripts) {
    XSS($pageHTML);
  }

  const parsedFonts = getUsedModelFontFamily();

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

  const body = dynamicContent($pageHTML("body").html() ?? "");

  // Clear all css after execute
  clearCSSCache();

  // Clear all extracted FontFamilies
  clearFamilyCache();

  return {
    html: body,
    assets: { freeScripts, freeStyles, proScripts, proStyles }
  };
};
