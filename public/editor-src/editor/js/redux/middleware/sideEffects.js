import jQuery from "jquery";
import Config from "visual/global/Config";
import {
  makeFontsUrl,
  makeRichTextFontFamiliesCSS,
  makeRichTextFontStylesCSS
} from "visual/utils/fonts";
import { makeRichTextColorPaletteCSS } from "visual/utils/color";
import { addClass, removeClass } from "visual/utils/dom/classNames";
import { currentStyleSelector } from "../selectors";
import {
  HYDRATE,
  UPDATE_GLOBALS,
  UPDATE_UI,
  COPY_ELEMENT,
  updateCopiedElement
} from "../actions";
import { ActionTypes as HistoryActionTypes } from "../reducers/historyEnhancer";
import { wInMobilePage, wInTabletPage } from "visual/config/columns";

const { UNDO, REDO } = HistoryActionTypes;

export default config => store => next => action => {
  if (action.type === HYDRATE) {
    const done = () => next(action);
    handleHydrate(config, store, action, done);
    return;
  }

  if (action.type === UPDATE_GLOBALS && action.key === "extraFonts") {
    const done = () => next(action);
    handleAddExtraFont(config, store, action, done);
    return;
  }

  if (action.type === UPDATE_GLOBALS && action.key === "styles") {
    const done = () => next(action);
    handleStylesChange(config, store, action, done);
    return;
  }

  if (action.type === UPDATE_UI && action.key === "deviceMode") {
    const done = () => next(action);
    handleDeviceModeChange(config, store, action, done);
    return;
  }

  if (action.type === COPY_ELEMENT) {
    const done = () => next(action);
    handleCopiedElementChange(config, store, action, done);
    return;
  }

  if (action.type === UNDO || action.type === REDO) {
    const done = () => next(action);
    handleHistoryChange(config, store, action, done);
    return;
  }

  next(action);
};

function handleHydrate(config, store, action, done) {
  done();

  const { document, parentDocument } = config;
  const { mergedFontStyles, colorPalette } = currentStyleSelector(
    store.getState()
  );

  // fonts
  const configFonts = Config.get("fonts");
  const globalsExtraFonts = action.payload.globals.extraFonts || [];
  const fontsToLoad = [...configFonts, ...globalsExtraFonts];
  const $fonts = jQuery("<link>").attr({
    href: makeFontsUrl(fontsToLoad),
    type: "text/css",
    rel: "stylesheet"
  });
  jQuery("head", document).append($fonts);
  jQuery("head", parentDocument).append($fonts.clone());

  const $richTextFontFamiliesStyle = jQuery("<style>")
    .attr("id", "brz-rich-text-font-families")
    .html(makeRichTextFontFamiliesCSS(fontsToLoad));
  jQuery("head", document).append($richTextFontFamiliesStyle);

  const $richTextFontStyle = jQuery("<style>")
    .attr("id", "brz-rich-text-font-styles")
    .html(makeRichTextFontStylesCSS(mergedFontStyles));
  jQuery("head", document).append($richTextFontStyle);

  const $richTextPaletteStyle = jQuery("<style>")
    .attr("id", "brz-rich-text-colors")
    .html(makeRichTextColorPaletteCSS(colorPalette));
  jQuery("head", document).append($richTextPaletteStyle);

  // clipboard sync between tabs
  jQuery(window).on("storage", e => {
    const { key, newValue, oldValue } = e.originalEvent;
    if (key === "copiedStyles" && newValue && newValue !== oldValue) {
      store.dispatch(updateCopiedElement(JSON.parse(newValue)));
    }
  });
}

function handleAddExtraFont(config, store, action, done) {
  const { document, parentDocument } = config;
  const addedFonts = action.meta.addedFonts;

  if (addedFonts.length === 0) {
    return;
  }

  const $addedFont = jQuery("<link>").attr({
    href: makeFontsUrl(addedFonts),
    type: "text/css",
    rel: "stylesheet"
  });

  jQuery("#brz-rich-text-font-families").append(
    makeRichTextFontFamiliesCSS(addedFonts)
  );

  jQuery("head", document).append($addedFont);
  jQuery("head", parentDocument).append($addedFont.clone());

  done();
}

function handleStylesChange(config, store, action, done) {
  done();

  const { mergedFontStyles, colorPalette } = currentStyleSelector(
    store.getState()
  );

  jQuery("#brz-rich-text-font-styles").html(
    makeRichTextFontStylesCSS(mergedFontStyles)
  );

  jQuery("#brz-rich-text-colors").html(
    makeRichTextColorPaletteCSS(colorPalette)
  );
}

function handleDeviceModeChange(config, store, action, done) {
  done();

  const { document, parentDocument } = config;
  const mode = action.value;

  const blocksIframe = parentDocument.getElementById("brz-ed-iframe");
  const oldIframeClassName = blocksIframe.className;
  const newIframeClassName = addClass(
    removeClass(oldIframeClassName, /^brz-ed-iframe--/),
    `brz-ed-iframe--${mode}`
  );

  const brz = document.getElementsByClassName("brz")[0];
  const oldBrzClassName = brz.className;
  const newBrzClassName = addClass(
    removeClass(oldBrzClassName, /^brz-ed--/),
    `brz-ed--${mode}`
  );

  const scrollWidth = blocksIframe.offsetWidth - document.body.offsetWidth;
  let iframeMaxWidth = "";

  if (scrollWidth > 0 && (mode === "mobile" || mode === "tablet")) {
    const wInPage = mode === "mobile" ? wInMobilePage : wInTabletPage;
    const extraSpace = scrollWidth + 30; // 30 is padding
    iframeMaxWidth = `${wInPage + extraSpace}px`;
  }

  requestAnimationFrame(() => {
    blocksIframe.className = newIframeClassName;
    brz.className = newBrzClassName;
    blocksIframe.style.maxWidth = iframeMaxWidth;
  });
}

function handleCopiedElementChange(config, store, action, done) {
  done();

  const oldCopiedStyles = localStorage.getItem("copiedStyles");
  const newCopiedStyles = JSON.stringify(action.value);

  if (oldCopiedStyles !== newCopiedStyles) {
    localStorage.setItem("copiedStyles", newCopiedStyles);
  }
}

function handleHistoryChange(config, store, action, done) {
  done();

  const currentGlobals = action.currentSnapshot.globals;
  const nextGlobals = action.nextSnapshot.globals;

  if (currentGlobals !== nextGlobals) {
    const { mergedFontStyles, colorPalette } = currentStyleSelector(
      store.getState()
    );

    jQuery("#brz-rich-text-font-styles").html(
      makeRichTextFontStylesCSS(mergedFontStyles)
    );

    jQuery("#brz-rich-text-colors").html(
      makeRichTextColorPaletteCSS(colorPalette)
    );
  }
}
