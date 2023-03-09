import jQuery from "jquery";
import _ from "underscore";
import { wInMobilePage, wInTabletPage } from "visual/config/columns";
import { StoreChanged } from "visual/redux/types";
import {
  makeGlobalStylesColorPalette,
  makeRichTextColorPaletteCSS
} from "visual/utils/color";
import { makeVariablesColor } from "visual/utils/cssVariables";
import { addClass, removeClass } from "visual/utils/dom/classNames";
import {
  makeDefaultFontCSS,
  makeGlobalStylesTypography,
  makeSubsetGoogleFontsUrl,
  makeUploadFontsUrl,
  projectFontsData
} from "visual/utils/fonts";
import {
  ADD_BLOCK,
  COPY_ELEMENT,
  HYDRATE,
  UPDATE_CURRENT_STYLE,
  UPDATE_CURRENT_STYLE_ID,
  UPDATE_UI,
  updateCopiedElement
} from "../actions";
import {
  ADD_FONTS,
  DELETE_FONTS,
  IMPORT_KIT,
  IMPORT_STORY,
  IMPORT_TEMPLATE,
  UPDATE_DEFAULT_FONT,
  UPDATE_EXTRA_FONT_STYLES
} from "../actions2";
import { historySelector } from "../history/selectors";
import { REDO, UNDO } from "../history/types";
import {
  currentLanguageSelector,
  currentRoleSelector,
  currentStyleSelector,
  fontsSelector,
  getDefaultFontDetailsSelector,
  storeWasChangedSelector,
  unDeletedFontsSelector
} from "../selectors";
import { defaultFontSelector, extraFontStylesSelector } from "../selectors-new";

export default (config) => (store) => (next) => (action) => {
  const callbacks = {
    onBeforeNext: [],
    onAfterNext: []
  };

  // show warning if the user wants to leave
  // without publishing / updating changes
  handleStoreChange(callbacks);

  if (action.type === HYDRATE) {
    handleHydrate(callbacks);
  }

  if (
    action.type === IMPORT_TEMPLATE ||
    action.type === IMPORT_KIT ||
    action.type === IMPORT_STORY ||
    action.type === ADD_BLOCK ||
    action.type === ADD_FONTS ||
    action.type === DELETE_FONTS ||
    action.type === UPDATE_DEFAULT_FONT
  ) {
    handleFontsChange(callbacks);
  }

  if (
    action.type === IMPORT_TEMPLATE ||
    action.type === UPDATE_CURRENT_STYLE_ID ||
    action.type === UPDATE_CURRENT_STYLE ||
    action.type === UPDATE_EXTRA_FONT_STYLES ||
    action.type === IMPORT_STORY
  ) {
    handleStylesChange(callbacks);
  }

  if (action.type === UPDATE_UI && action.key === "deviceMode") {
    handleDeviceModeChange(callbacks);
  }

  if (action.type === UPDATE_UI && action.key === "showHiddenElements") {
    handleHiddenElementsChange(callbacks);
  }

  if (action.type === UPDATE_UI && action.key === "currentRole") {
    handleCurrentRoleChange(callbacks);
  }

  if (action.type === COPY_ELEMENT) {
    handleCopiedElementChange(callbacks);
  }

  if (action.type === UNDO || action.type === REDO) {
    handleHistoryChange(callbacks);
  }

  if (action.type === UPDATE_UI && action.key === "currentLanguage") {
    handleCurrentLanguageChange(callbacks);
  }

  const oldState = store.getState();

  // Now is not used
  // uncomment if need
  // callbacks.onBeforeNext.forEach(task => task({ config, state: oldState, action }));

  next(action);

  const state = store.getState();
  callbacks.onAfterNext.forEach((task) =>
    task({ config, state, oldState, store, action })
  );
};

function handleStoreChange(callbacks) {
  callbacks.onAfterNext.push(({ state, oldState }) => {
    const oldStateWasChanged = storeWasChangedSelector(oldState);
    const storeWasChanged = storeWasChangedSelector(state);

    if (oldStateWasChanged !== storeWasChanged) {
      const window_ = window.parent || window;

      switch (storeWasChanged) {
        case StoreChanged.changed: {
          window_.addEventListener("beforeunload", handleBeforeUnload);
          break;
        }
        case StoreChanged.unchanged: {
          window_.removeEventListener("beforeunload", handleBeforeUnload);
          break;
        }
      }
    }
  });
}

function handleHydrate(callbacks) {
  callbacks.onAfterNext.push(({ state, store, config }) => {
    const { document, parentDocument } = config;
    const currentFonts = projectFontsData(unDeletedFontsSelector(state));
    const { colorPalette, fontStyles: _fontStyles } =
      currentStyleSelector(state);
    const extraFontStyles = extraFontStylesSelector(state);
    const fontStyles = [..._fontStyles, ...extraFontStyles];

    const defaultFont = getDefaultFontDetailsSelector(state);
    // Generate default @fontFace uses in project font
    const $defaultFonts = jQuery("<style>")
      .attr("id", "brz-project-default-font")
      .html(makeDefaultFontCSS(defaultFont));

    jQuery("head", document).append($defaultFonts);
    jQuery("head", parentDocument).append($defaultFonts.clone());

    // added project fonts to Head
    if (currentFonts.google?.length) {
      const $googleFonts = jQuery("<link>").attr({
        href: makeSubsetGoogleFontsUrl(currentFonts.google),
        type: "text/css",
        rel: "stylesheet"
      });

      jQuery("head", document).append($googleFonts);
      jQuery("head", parentDocument).append($googleFonts.clone());
    }

    if (currentFonts.upload?.length) {
      const $uploadFonts = jQuery("<link>").attr({
        href: makeUploadFontsUrl(currentFonts.upload),
        type: "text/css",
        rel: "stylesheet"
      });
      jQuery("head", document).append($uploadFonts);
      jQuery("head", parentDocument).append($uploadFonts.clone());
    }

    // Typography
    const typographyStyle = jQuery("<style>")
      .attr("id", "brz-typography-styles")
      .html(makeGlobalStylesTypography(fontStyles));
    jQuery("head", document).append(typographyStyle);

    // Config _variables scss
    const themeVariables = makeVariablesColor();
    if (themeVariables) {
      const configVariables = jQuery("<style>")
        .attr({ type: "text/css", rel: "stylesheet", id: "themeVariables" })
        .html(themeVariables);

      jQuery("head", document).append(configVariables);
      jQuery("head", parentDocument).append(configVariables.clone());
    }
    // ColorPalette
    const $richTextPaletteStyle = jQuery("<style>")
      .attr("id", "brz-rich-text-colors")
      .html(makeRichTextColorPaletteCSS(colorPalette));
    const $globalColorStyles = jQuery("<style>")
      .attr("id", "brz-global-colors")
      .html(makeGlobalStylesColorPalette(colorPalette));

    jQuery("head", document).append($richTextPaletteStyle);
    jQuery("head", document).append($globalColorStyles);

    // Hidden Elements
    document.body.style.setProperty("--elements-visibility", "none");

    // clipboard sync between tabs
    jQuery(window).on("storage", (e) => {
      const { key, newValue, oldValue } = e.originalEvent;
      if (key === "copiedStyles" && newValue && newValue !== oldValue) {
        store.dispatch(updateCopiedElement(JSON.parse(newValue)));
      }
    });
  });
}

function handleFontsChange(callbacks) {
  callbacks.onAfterNext.push(({ config, state, oldState, action }) => {
    const oldFonts = fontsSelector(oldState);
    const oldDefaultFont = defaultFontSelector(oldState);
    const newFonts = fontsSelector(state);
    const newDefaultFont = defaultFontSelector(state);

    if (newFonts === oldFonts && newDefaultFont === oldDefaultFont) {
      return;
    }

    const { document, parentDocument } = config;

    // Generate new Link for new Fonts
    if (action.type !== DELETE_FONTS) {
      diffFonts(oldState.fonts, state.fonts).forEach(({ type, fonts }) => {
        const href =
          type === "upload"
            ? makeUploadFontsUrl(fonts)
            : makeSubsetGoogleFontsUrl(fonts);
        const $addedFont = jQuery("<link>").attr({
          href,
          type: "text/css",
          rel: "stylesheet"
        });

        jQuery("head", document).append($addedFont);
        jQuery("head", parentDocument).append($addedFont.clone());
      });
    }
  });
}

function handleStylesChange(callbacks) {
  callbacks.onAfterNext.push(({ state }) => {
    const { colorPalette, fontStyles: _fontStyles } =
      currentStyleSelector(state);
    const extraFontStyles = extraFontStylesSelector(state);
    const fontStyles = [..._fontStyles, ...extraFontStyles];

    jQuery("#brz-rich-text-colors").html(
      makeRichTextColorPaletteCSS(colorPalette)
    );

    jQuery("#brz-global-colors").html(
      makeGlobalStylesColorPalette(colorPalette)
    );

    jQuery("#brz-typography-styles").html(
      makeGlobalStylesTypography(fontStyles)
    );
  });
}

function handleDeviceModeChange(callbacks) {
  callbacks.onAfterNext.push(({ config, action }) => {
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
  });
}

function handleHiddenElementsChange(callbacks) {
  callbacks.onAfterNext.push(({ config, action }) => {
    const { document } = config;
    const value = action.value;

    if (value) {
      document.body.style.removeProperty("--elements-visibility");
    } else {
      document.body.style.setProperty("--elements-visibility", "none");
    }
  });
}

function handleCurrentRoleChange(callbacks) {
  callbacks.onAfterNext.push(({ config, oldState, action }) => {
    const { document } = config;
    const oldRole = currentRoleSelector(oldState).replace(/\//g, "");
    const newRole = action.value.replace(/\//g, "");

    document.body.style.removeProperty(`--role-${oldRole}`);

    if (newRole !== "default") {
      document.body.style.setProperty(`--role-${newRole}`, "none");
    }
  });
}

function handleCurrentLanguageChange(callbacks) {
  callbacks.onAfterNext.push(({ config, oldState, action }) => {
    const { document } = config;
    const oldLanguage = currentLanguageSelector(oldState).replace(/\//g, "");
    const newLanguage = action.value.replace(/\//g, "");

    document.body.style.removeProperty(`--lang-${oldLanguage}`);

    if (newLanguage !== "default") {
      document.body.style.setProperty(`--lang-${newLanguage}`, "none");
    }
  });
}

function handleCopiedElementChange(callbacks) {
  callbacks.onAfterNext.push(({ action }) => {
    const oldCopiedStyles = localStorage.getItem("copiedStyles");
    const newCopiedStyles = JSON.stringify(action.value);

    if (oldCopiedStyles !== newCopiedStyles) {
      localStorage.setItem("copiedStyles", newCopiedStyles);
    }
  });
}

function handleHistoryChange(callbacks) {
  callbacks.onAfterNext.push(({ state }) => {
    const { currSnapshot, prevSnapshot } = historySelector(state);
    const currStyleId = currSnapshot?.currentStyleId;
    const prevStyleId = prevSnapshot?.currentStyleId;
    const currStyle = currSnapshot?.currentStyle;
    const prevStyle = prevSnapshot?.currentStyle;

    if (currStyleId !== prevStyleId || currStyle !== prevStyle) {
      const { colorPalette, fontStyles: _fontStyles } =
        currentStyleSelector(state);
      const extraFontStyles = extraFontStylesSelector(state);
      const fontStyles = [..._fontStyles, ...extraFontStyles];

      jQuery("#brz-typography-styles").html(
        makeGlobalStylesTypography(fontStyles)
      );

      jQuery("#brz-rich-text-colors").html(
        makeRichTextColorPaletteCSS(colorPalette)
      );

      jQuery("#brz-global-colors").html(
        makeGlobalStylesColorPalette(colorPalette)
      );
    }
  });
}

function handleBeforeUnload(e) {
  e.preventDefault();
  e.returnValue = "Do you really want to close?";
}

function diffFonts(oldFonts, fonts) {
  return Object.entries(fonts).reduce((acc, [type, { data }]) => {
    const oldFont = oldFonts[type];

    if (!oldFont) {
      return [...acc, { type, fonts: data }];
    }

    if (oldFont.data !== data) {
      return [...acc, { type, fonts: _.difference(data, oldFont.data) }];
    }

    return acc;
  }, []);
}
