import cheerio from "cheerio";
import { ReactElement } from "react";
import ReactDOMServer from "react-dom/server";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Sheet } from "visual/providers/StyleProvider/Sheet";
import {
  defaultFontSelector,
  fontsSelector,
  getDefaultFontDetailsSelector
} from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import {
  clearFamilyCache,
  getUsedModelFontFamily
} from "visual/utils/options/getDetailsModelFontFamily";
import { getAssets } from "../transforms/assets";
import { makeSymbols } from "../transforms/assets/makeSymbols";
import { changeMenuUid } from "../transforms/changeMenuUid";
import { customAttributes } from "../transforms/customAttributes";
import { dynamicContent } from "../transforms/dynamicContent";
import { getUsedFonts } from "../utils/getUsedFonts";
import { Output } from "./types";

interface Props {
  store: Store;
  Page: ReactElement;
  sheet: Readonly<Sheet>;
  config: ConfigCommon;
}

export const baseToStatic = (props: Props): Output => {
  const { store, sheet, config, Page } = props;
  const reduxState = store.getState();
  const projectDefaultFontId = defaultFontSelector(reduxState);

  // Clear all extracted FontFamilies
  clearFamilyCache();

  const html = ReactDOMServer.renderToStaticMarkup(Page);

  // === Extract all css from CSS generator ===
  const dynamicCss = sheet.getCSSOrdered();

  const symbols = makeSymbols(dynamicCss.symbol);

  // ===========

  const $pageHTML = cheerio.load(
    `<html>
      <head></head>
      <body>${html}</body>
    </html>`,
    // was added because of this issue
    // https://github.com/bagrinsergiu/blox-editor/issues/13929
    { decodeEntities: false }
  );

  changeMenuUid($pageHTML);
  customAttributes($pageHTML);

  const parsedFonts = getUsedModelFontFamily();

  const usedFonts = getUsedFonts({
    projectDefaultFontId,
    parsedFonts,
    fonts: fontsSelector(reduxState),
    defaultFont: getDefaultFontDetailsSelector(reduxState)
  });

  const { fonts, adobeKitId } = usedFonts;
  const { freeScripts, freeStyles, proScripts, proStyles } = getAssets({
    $root: $pageHTML,
    fonts,
    css: dynamicCss,
    config,
    extra: { adobeKitId }
  });

  const body = dynamicContent($pageHTML("body").html() ?? "");

  // Clear all css after execute
  sheet.purge();

  // Clear all extracted FontFamilies
  clearFamilyCache();

  return {
    html: body,
    assets: { freeScripts, freeStyles, proScripts, proStyles },
    symbols
  };
};
