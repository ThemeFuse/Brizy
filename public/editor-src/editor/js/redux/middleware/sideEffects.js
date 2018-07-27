import jQuery from "jquery";
import Config from "visual/global/Config";
import {
  makeFontsUrl,
  makeRichTextFontFamiliesCSS,
  makeRichTextFontStylesCSS
} from "visual/utils/fonts";
import { makeRichTextColorPaletteCSS } from "visual/utils/color";
import { addClass, removeClass } from "visual/utils/dom/classNames";
import { HYDRATE, UPDATE_GLOBALS, UPDATE_UI } from "../actionTypes";
import { ActionTypes as HistoryActionTypes } from "../reducers/historyEnhancer";

const { UNDO, REDO } = HistoryActionTypes;

const currentSkin = "default";

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

  if (action.type === UNDO || action.type === REDO) {
    const done = () => next(action);
    handleHistoryChange(config, store, action, done);
    return;
  }

  next(action);
};

function handleHydrate(config, store, action, done) {
  const { document, parentDocument } = config;

  // fonts
  const configFonts = Config.get("fonts");
  const globalsExtraFonts = action.globals.project.extraFonts || [];
  const fontsToLoad = [...configFonts, ...globalsExtraFonts];
  const $fonts = jQuery("<link>").attr({
    href: makeFontsUrl(fontsToLoad),
    type: "text/css",
    rel: "stylesheet"
  });

  jQuery("head", document).append($fonts);
  jQuery("head", parentDocument).append($fonts.clone());

  // rich text font families
  const richTextFontFamiliesCSS = makeRichTextFontFamiliesCSS(fontsToLoad);
  const $richTextFontFamiliesStyle = jQuery("<style>")
    .attr("id", "brz-rich-text-font-families")
    .text(richTextFontFamiliesCSS);

  jQuery("head", document).append($richTextFontFamiliesStyle);

  done();

  const { fontStyles, colorPalette } = store.getState().styles;

  // rich text font styles
  // NOTE: this is called after done() intentionally
  // because it needs the computed store
  const richTextFontStylesCSS = makeRichTextFontStylesCSS(fontStyles);
  const $richTextFontStyle = jQuery("<style>")
    .attr("id", "brz-rich-text-font-styles")
    .text(richTextFontStylesCSS);

  jQuery("head", document).append($richTextFontStyle);

  // rich text colors
  // NOTE: this is called after done() intentionally
  // because it needs the computed store
  const richTextPaletteCSS = makeRichTextColorPaletteCSS(colorPalette);
  const $richTextPaletteStyle = jQuery("<style>")
    .attr("id", "brz-rich-text-colors")
    .text(richTextPaletteCSS);

  jQuery("head", document).append($richTextPaletteStyle);
}

function handleAddExtraFont(config, store, action, done) {
  const { document, parentDocument } = config;

  const addedFont = action.meta.addedFont;
  const $addedFont = jQuery("<link>").attr({
    href: makeFontsUrl([addedFont]),
    type: "text/css",
    rel: "stylesheet"
  });

  jQuery("#brz-rich-text-font-families").append(
    makeRichTextFontFamiliesCSS([addedFont])
  );

  jQuery("head", document).append($addedFont);
  jQuery("head", parentDocument).append($addedFont.clone());

  done();
}

function handleStylesChange(config, store, action, done) {
  const { colorPalette, fontStyles } = action.value[currentSkin];

  jQuery("#brz-rich-text-colors").html(
    makeRichTextColorPaletteCSS(colorPalette)
  );

  jQuery("#brz-rich-text-font-styles").html(
    makeRichTextFontStylesCSS(fontStyles)
  );

  done();
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

  requestAnimationFrame(() => {
    blocksIframe.className = newIframeClassName;
    brz.className = newBrzClassName;
  });
}

function handleHistoryChange(config, store, action, done) {
  done();

  const currentStyles = action.currentSnapshot.styles;
  const nextStyles = action.nextSnapshot.styles;

  if (currentStyles.fontStyles !== nextStyles.fontStyles) {
    const fontStyles = nextStyles.fontStyles;

    jQuery("#brz-rich-text-font-styles").html(
      makeRichTextFontStylesCSS(fontStyles)
    );
  }

  if (currentStyles.colorPalette !== nextStyles.colorPalette) {
    const colorPalette = nextStyles.colorPalette;

    jQuery("#brz-rich-text-colors").html(
      makeRichTextColorPaletteCSS(colorPalette)
    );
  }
}
