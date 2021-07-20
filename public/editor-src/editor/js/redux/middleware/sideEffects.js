import jQuery from "jquery";
import _ from "underscore";
import {
  getDefaultFont,
  makeDefaultFontCSS,
  makeUploadFontsUrl,
  projectFontsData
} from "visual/utils/fonts";
import { makeRichTextColorPaletteCSS } from "visual/utils/color";
import { addClass, removeClass } from "visual/utils/dom/classNames";
import {
  currentStyleSelector,
  currentRoleSelector,
  unDeletedFontSelector
} from "../selectors";
import {
  HYDRATE,
  ADD_BLOCK,
  UPDATE_BLOCKS,
  REMOVE_BLOCK,
  REORDER_BLOCKS,
  UPDATE_GLOBAL_BLOCK,
  UPDATE_UI,
  COPY_ELEMENT,
  updateCopiedElement,
  UPDATE_CURRENT_STYLE_ID,
  UPDATE_CURRENT_STYLE,
  IMPORT_TEMPLATE,
  IMPORT_KIT,
  ADD_FONTS,
  DELETE_FONTS
} from "../actions";
import { IMPORT_STORY, PUBLISH, UPDATE_EXTRA_FONT_STYLES } from "../actions2";
import { wInMobilePage, wInTabletPage } from "visual/config/columns";
import { makeSubsetGoogleFontsUrl } from "visual/utils/fonts";
import { UNDO, REDO } from "../history/types";
import { historySelector } from "../history/selectors";

export default config => store => next => action => {
  const callbacks = {
    onBeforeNext: [],
    onAfterNext: []
  };

  // show warning if the user wants to leave
  // without publishing / updating changes
  switch (action.type) {
    case ADD_BLOCK:
    case REMOVE_BLOCK:
    case REORDER_BLOCKS:
    case UPDATE_BLOCKS:
    case UPDATE_GLOBAL_BLOCK:
    case UPDATE_CURRENT_STYLE_ID:
    case UPDATE_CURRENT_STYLE:
    case UPDATE_EXTRA_FONT_STYLES:
    case IMPORT_TEMPLATE:
    case UNDO:
    case REDO: {
      const window_ = window.parent || window;
      window_.addEventListener("beforeunload", handleBeforeUnload);
      break;
    }
    case PUBLISH: {
      const window_ = window.parent || window;
      window_.removeEventListener("beforeunload", handleBeforeUnload);
      break;
    }
  }

  if (action.type === HYDRATE) {
    handleHydrate(callbacks);
  }

  if (
    action.type === IMPORT_TEMPLATE ||
    action.type === IMPORT_KIT ||
    action.type === ADD_BLOCK ||
    action.type === ADD_FONTS ||
    action.type === DELETE_FONTS ||
    action.type === IMPORT_STORY
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

  const oldState = store.getState();

  // Now is not used
  // uncomment if need
  // callbacks.onBeforeNext.forEach(task => task({ config, state: oldState, action }));

  next(action);

  const state = store.getState();
  callbacks.onAfterNext.forEach(task =>
    task({ config, state, oldState, store, action })
  );
};

function handleHydrate(callbacks) {
  callbacks.onAfterNext.push(({ state, store, config }) => {
    const { document, parentDocument } = config;
    const currentFonts = projectFontsData(unDeletedFontSelector(state));
    const { colorPalette } = currentStyleSelector(state);
    const defaultFont = getDefaultFont(state);

    // Generate default @fontFace uses in project font
    const $defaultFonts = jQuery("<style>")
      .attr("id", "brz-project-default-font")
      .html(makeDefaultFontCSS(defaultFont));

    jQuery("head", document).append($defaultFonts);
    jQuery("head", parentDocument).append($defaultFonts.clone());

    // added project fonts to Head
    const $googleFonts = jQuery("<link>").attr({
      href: makeSubsetGoogleFontsUrl(currentFonts.google),
      type: "text/css",
      rel: "stylesheet"
    });

    jQuery("head", document).append($googleFonts);
    jQuery("head", parentDocument).append($googleFonts.clone());

    if (currentFonts.upload && currentFonts.upload.length > 0) {
      const $uploadFonts = jQuery("<link>").attr({
        href: makeUploadFontsUrl(currentFonts.upload),
        type: "text/css",
        rel: "stylesheet"
      });
      jQuery("head", document).append($uploadFonts);
      jQuery("head", parentDocument).append($uploadFonts.clone());
    }

    // ColorPalette
    const $richTextPaletteStyle = jQuery("<style>")
      .attr("id", "brz-rich-text-colors")
      .html(makeRichTextColorPaletteCSS(colorPalette));
    jQuery("head", document).append($richTextPaletteStyle);

    // Hidden Elements
    document.body.style.setProperty("--elements-visibility", "none");

    // Hidden Membership Blocks
    document.body.style.setProperty("--role-default", "block");

    // clipboard sync between tabs
    jQuery(window).on("storage", e => {
      const { key, newValue, oldValue } = e.originalEvent;
      if (key === "copiedStyles" && newValue && newValue !== oldValue) {
        store.dispatch(updateCopiedElement(JSON.parse(newValue)));
      }
    });
  });
}

function handleFontsChange(callbacks) {
  callbacks.onAfterNext.push(({ config, state, oldState, action }) => {
    if (state.fonts === oldState.fonts) {
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
    const { colorPalette } = currentStyleSelector(state);

    jQuery("#brz-rich-text-colors").html(
      makeRichTextColorPaletteCSS(colorPalette)
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
    const oldRole = currentRoleSelector(oldState);
    const newRole = action.value;

    document.body.style.removeProperty(`--role-${oldRole}`);
    document.body.style.setProperty(`--role-${newRole}`, "block");
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
    const currStyleId = currSnapshot.currentStyleId;
    const prevStyleId = prevSnapshot.currentStyleId;
    const currStyle = currSnapshot.currentStyle;
    const prevStyle = prevSnapshot.currentStyle;

    if (currStyleId !== prevStyleId || currStyle !== prevStyle) {
      const { colorPalette } = currentStyleSelector(state);

      jQuery("#brz-rich-text-colors").html(
        makeRichTextColorPaletteCSS(colorPalette)
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
