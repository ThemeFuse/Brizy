import { Obj } from "@brizy/readers";
import { difference } from "es-toolkit";
import {
  type AnyAction,
  type Dispatch,
  Middleware,
  type MiddlewareAPI
} from "redux";
import { wInMobilePage, wInTabletPage } from "visual/config/columns";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import type { ReduxAction } from "visual/redux/actions2";
import type { Store } from "visual/redux/store";
import type { ReduxState, ReduxStateWithHistory } from "visual/redux/types";
import { StoreChanged } from "visual/redux/types";
import type {
  AdobeFont,
  Font,
  Fonts,
  GoogleFont,
  SystemFont,
  UploadedFont
} from "visual/types/Fonts";
import {
  makeGlobalStylesColorPalette,
  makeRichTextColorPaletteCSS
} from "visual/utils/color";
import { makeVariablesColor } from "visual/utils/cssVariables";
import { addClass, removeClass } from "visual/utils/dom/classNames";
import { makeAdobeFontsUrl } from "visual/utils/fonts/makeAdobeFontsUrl";
import { makeDefaultFontCSS } from "visual/utils/fonts/makeDefaultFontCSS";
import {
  makeSubsetGoogleFontsUrl,
  makeUploadFontsUrl
} from "visual/utils/fonts/makeFontsUrl";
import { makeGlobalStylesTypography } from "visual/utils/fonts/makeGlobalStylesTypography";
import { projectFontsData } from "visual/utils/fonts/transform";
import {
  getClosestSections,
  isElementInViewport,
  scrollToActiveElement,
  scrollToClosestCenterSection
} from "visual/utils/viewport";
import { ADD_BLOCK, HYDRATE, UPDATE_UI } from "../actions";
import {
  ADD_FONTS,
  ActionTypes,
  DELETE_FONTS,
  UPDATE_DEFAULT_FONT,
  UPDATE_EXTRA_FONT_STYLES,
  updateCopiedElement,
  updateUI
} from "../actions2";
import { historySelector } from "../history/selectors";
import { REDO, UNDO } from "../history/types";
import {
  currentLanguageSelector,
  currentRoleSelector,
  currentStyleSelector,
  defaultFontSelector,
  extraFontStylesSelector,
  fontsSelector,
  getDefaultFontDetailsSelector,
  storeWasChangedSelector,
  unDeletedFontsSelector
} from "../selectors";

interface SideEffectsConfig {
  document: Document;
  parentDocument?: Document;
  getConfig: GetConfig;
}

interface CallbackTaskParams {
  config: SideEffectsConfig;
  state: ReduxState;
  oldState: ReduxState;
  store: MiddlewareAPI<Dispatch<AnyAction>, ReduxState>;
  action: ReduxAction;
}

interface Callbacks {
  onBeforeNext: Array<(params: CallbackTaskParams) => void>;
  onAfterNext: Array<(params: CallbackTaskParams) => void>;
}

type DiffFontResult =
  | { type: "google" | "config" | "blocks"; fonts: GoogleFont[] }
  | { type: "adobe"; fonts: AdobeFont[] }
  | { type: "upload"; fonts: UploadedFont[] }
  | { type: "system"; fonts: SystemFont[] };

export default (
    config: SideEffectsConfig
  ): Middleware<Record<string, never>, ReduxState, Dispatch<ReduxAction>> =>
  (store) =>
  (next) =>
  (action) => {
    const callbacks: Callbacks = {
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
      action.type === ActionTypes.IMPORT_TEMPLATE ||
      action.type === ActionTypes.IMPORT_KIT ||
      action.type === ActionTypes.IMPORT_STORY ||
      action.type === ADD_BLOCK ||
      action.type === ADD_FONTS ||
      action.type === DELETE_FONTS ||
      action.type === UPDATE_DEFAULT_FONT
    ) {
      handleFontsChange(callbacks);
    }

    if (
      action.type === ActionTypes.IMPORT_TEMPLATE ||
      action.type === ActionTypes.UPDATE_CURRENT_STYLE_ID ||
      action.type === ActionTypes.UPDATE_CURRENT_STYLE ||
      action.type === ActionTypes.REMOVE_GLOBAL_STYLE ||
      action.type === ActionTypes.REGENERATE_COLORS ||
      action.type === ActionTypes.REGENERATE_TYPOGRAPHY ||
      action.type === UPDATE_EXTRA_FONT_STYLES ||
      action.type === ActionTypes.IMPORT_STORY
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

    if (action.type === ActionTypes.COPY_ELEMENT) {
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
    callbacks.onAfterNext.forEach(
      (task: (params: CallbackTaskParams) => void) => {
        const taskParams: CallbackTaskParams = {
          config,
          state,
          oldState,
          store,
          action
        };
        task(taskParams);
      }
    );
  };

function handleStoreChange(callbacks: Callbacks): void {
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

function handleHydrate(callbacks: Callbacks): void {
  callbacks.onAfterNext.push(({ state, store, config, action }) => {
    const { document, parentDocument } = config;
    const currentFonts = projectFontsData(unDeletedFontsSelector(state)) as {
      google?: GoogleFont[];
      adobe?: AdobeFont[];
      upload?: UploadedFont[];
      system?: unknown[];
    };
    const { colorPalette, fontStyles: _fontStyles } =
      currentStyleSelector(state);
    const extraFontStyles = extraFontStylesSelector(state);
    const fontStyles = [..._fontStyles, ...extraFontStyles];
    const adobeKitId = state?.fonts?.adobe?.id;
    const { config: globalConfig } = (
      action as { payload: { config: ReturnType<GetConfig> } }
    ).payload;

    if (document.getElementById("brz-project-default-font") === null) {
      // Generate default @fontFace uses in project font
      const defaultFont = getDefaultFontDetailsSelector(state);
      const defaultFonts = document.createElement("style");
      defaultFonts.id = "brz-project-default-font";
      defaultFonts.innerHTML = makeDefaultFontCSS(defaultFont);

      document.head.appendChild(defaultFonts);
      parentDocument?.head.appendChild(defaultFonts.cloneNode());
    }

    // added project fonts to Head
    if (
      currentFonts.google?.length &&
      document.getElementById("brz-project-font-links") === null
    ) {
      const googleFonts = document.createElement("link");
      googleFonts.id = "brz-project-font-links";
      googleFonts.href = makeSubsetGoogleFontsUrl(currentFonts.google);
      googleFonts.setAttribute("type", "text/css");
      googleFonts.setAttribute("rel", "stylesheet");
      document.head.appendChild(googleFonts);
      parentDocument?.head.appendChild(googleFonts.cloneNode());
    }

    if (
      currentFonts.adobe?.length &&
      adobeKitId &&
      document.getElementById("brz-project-adobe-font-links") === null
    ) {
      const adobeFonts = document.createElement("link");
      adobeFonts.id = "brz-project-adobe-font-links";
      adobeFonts.href = makeAdobeFontsUrl(adobeKitId);
      adobeFonts.setAttribute("type", "text/css");
      adobeFonts.setAttribute("rel", "stylesheet");
      document.head.append(adobeFonts);
      parentDocument?.head.append(adobeFonts.cloneNode());
    }

    if (
      currentFonts.upload?.length &&
      document.getElementById("brz-project-upload-font-links") === null
    ) {
      const uploadFonts = document.createElement("link");
      uploadFonts.id = "brz-project-upload-font-links";
      uploadFonts.href = makeUploadFontsUrl(currentFonts.upload, globalConfig);
      uploadFonts.setAttribute("type", "text/css");
      uploadFonts.setAttribute("rel", "stylesheet");
      document.head.append(uploadFonts);
      parentDocument?.head.append(uploadFonts.cloneNode());
    }

    if (document.getElementById("brz-typography-styles") === null) {
      // Typography
      const typographyStyle = document.createElement("style");
      typographyStyle.id = "brz-typography-styles";
      typographyStyle.innerHTML = makeGlobalStylesTypography({
        fontStyles,
        store: store as Store,
        config: globalConfig
      });

      document.head.appendChild(typographyStyle);
    }

    // Config _variables scss
    const colors = globalConfig?.ui?.theme?.colors ?? {};
    const themeVariables = makeVariablesColor(colors);

    if (themeVariables && document.getElementById("themeVariables") === null) {
      const configVariables = document.createElement("style");
      configVariables.id = "themeVariables";
      configVariables.innerHTML = themeVariables;
      configVariables.setAttribute("type", "text/css");
      configVariables.setAttribute("rel", "stylesheet");

      document.head.appendChild(configVariables);
      parentDocument?.head.appendChild(configVariables.cloneNode(true));
    }

    if (document.getElementById("brz-rich-text-colors") === null) {
      // ColorPalette
      const richTextPaletteStyle = document.createElement("style");
      richTextPaletteStyle.id = "brz-rich-text-colors";
      richTextPaletteStyle.innerHTML = makeRichTextColorPaletteCSS(
        colorPalette,
        globalConfig
      );
      document.head.appendChild(richTextPaletteStyle);
    }

    if (document.getElementById("brz-global-colors") === null) {
      const globalColorStyles = document.createElement("style");
      globalColorStyles.id = "brz-global-colors";
      globalColorStyles.innerHTML = makeGlobalStylesColorPalette(
        colorPalette,
        globalConfig
      );
      document.head.appendChild(globalColorStyles);
    }

    // Hidden Elements
    document.body.style.setProperty("--elements-visibility", "none");

    // clipboard sync between tabs
    window.addEventListener("storage", (e) => {
      const { key, newValue, oldValue } = e;
      if (key === "copiedStyles" && newValue && newValue !== oldValue) {
        store.dispatch(updateCopiedElement(JSON.parse(newValue)));
      }
    });
  });
}

function handleFontsChange(callbacks: Callbacks): void {
  callbacks.onAfterNext.push(({ config, state, oldState, action }) => {
    const oldFonts = fontsSelector(oldState);
    const oldDefaultFont = defaultFontSelector(oldState);
    const newFonts = fontsSelector(state);
    const newDefaultFont = defaultFontSelector(state);

    if (newFonts === oldFonts && newDefaultFont === oldDefaultFont) {
      return;
    }

    const { document, parentDocument, getConfig } = config;

    const globalConfig = getConfig();

    // Generate new Link for new Fonts
    if (action.type !== DELETE_FONTS) {
      const adobeKitId = state?.fonts?.adobe?.id;

      diffFonts(oldState.fonts, state.fonts).forEach(({ type, fonts }) => {
        let href: string | undefined;

        if (type === "upload") {
          href = makeUploadFontsUrl(fonts as UploadedFont[], globalConfig);
        } else if (type === "adobe") {
          if (adobeKitId) href = makeAdobeFontsUrl(adobeKitId);
        } else {
          href = makeSubsetGoogleFontsUrl(fonts as GoogleFont[]);
        }

        if (href) {
          const addedFont = document.createElement("link");
          addedFont.href = href;
          addedFont.setAttribute("type", "text/css");
          addedFont.setAttribute("rel", "stylesheet");

          document.head.appendChild(addedFont);
          parentDocument?.head.appendChild(addedFont.cloneNode());
        }
      });
    }
  });
}

function handleStylesChange(callbacks: Callbacks): void {
  callbacks.onAfterNext.push(({ state, store, config: _config }) => {
    const { colorPalette, fontStyles: _fontStyles } =
      currentStyleSelector(state);
    const config = _config.getConfig();

    const richTextColor = document.querySelector("#brz-rich-text-colors");
    const globalColor = document.querySelector("#brz-global-colors");
    const globalFontStyles = document.querySelector("#brz-typography-styles");

    if (richTextColor) {
      richTextColor.innerHTML = makeRichTextColorPaletteCSS(
        colorPalette,
        config
      );
    }

    if (globalColor) {
      globalColor.innerHTML = makeGlobalStylesColorPalette(
        colorPalette,
        config
      );
    }

    if (globalFontStyles) {
      const extraFontStyles = extraFontStylesSelector(state);
      const fontStyles = [..._fontStyles, ...extraFontStyles];
      globalFontStyles.innerHTML = makeGlobalStylesTypography({
        fontStyles,
        store: store as Store,
        config
      });
    }
  });
}

function handleDeviceModeChange(callbacks: Callbacks): void {
  callbacks.onAfterNext.push(({ config, action, state, store }) => {
    const { document, parentDocument } = config;
    const {
      ui: { activeElement }
    } = state;
    const defaultView = document.defaultView;
    if (!defaultView) return;

    const { innerHeight, document: viewportDocument, scrollTo } = defaultView;

    const activeElementHTMLElement =
      activeElement instanceof HTMLElement ? activeElement : null;
    const isActiveElementInView = activeElementHTMLElement
      ? isElementInViewport(activeElementHTMLElement, innerHeight)
      : false;
    let sections: HTMLElement[] = [];

    if (!isActiveElementInView) {
      store.dispatch(updateUI("activeElement", null));
      sections = getClosestSections(viewportDocument, innerHeight);
    }

    const mode = Obj.readKey("value")(action);

    const blocksIframe = parentDocument?.getElementById("brz-ed-iframe");
    if (!blocksIframe) return;

    const oldIframeClassName = blocksIframe.className;
    const newIframeClassName = addClass(
      removeClass(oldIframeClassName, /^brz-ed-iframe--/),
      `brz-ed-iframe--${mode}`
    );

    const brzElement = document.getElementsByClassName("brz")[0];
    if (!brzElement || !(brzElement instanceof HTMLElement)) return;
    const brz = brzElement;

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

      isActiveElementInView && activeElementHTMLElement
        ? scrollToActiveElement({
            activeElement: activeElementHTMLElement,
            document: viewportDocument,
            scrollTo,
            innerHeight,
            maxRecursion: 5
          })
        : scrollToClosestCenterSection(
            sections,
            viewportDocument,
            scrollTo,
            innerHeight
          );
    });
  });
}

function handleHiddenElementsChange(callbacks: Callbacks): void {
  callbacks.onAfterNext.push(({ config, action }) => {
    const { document } = config;
    const value = Obj.readKey("value")(action);
    if (typeof value !== "boolean") return;

    if (value) {
      document.body.style.removeProperty("--elements-visibility");
    } else {
      document.body.style.setProperty("--elements-visibility", "none");
    }
  });
}

function handleCurrentRoleChange(callbacks: Callbacks): void {
  callbacks.onAfterNext.push(({ config, oldState, action }) => {
    const { document } = config;
    const oldRole = currentRoleSelector(oldState).replace(/\//g, "");
    const newRole = Obj.readKey("value")(action);
    if (typeof newRole !== "string") return;

    const newRoleValue = newRole.replace(/\//g, "");

    document.body.style.removeProperty(`--role-${oldRole}`);

    if (newRoleValue !== "default") {
      document.body.style.setProperty(`--role-${newRoleValue}`, "none");
    }
  });
}

function handleCurrentLanguageChange(callbacks: Callbacks): void {
  callbacks.onAfterNext.push(({ config, oldState, action }) => {
    const { document } = config;
    const oldLanguage = currentLanguageSelector(oldState).replace(/\//g, "");
    const newLanguage = Obj.readKey("value")(action);
    if (typeof newLanguage !== "string") return;
    const newLanguageValue = newLanguage.replace(/\//g, "");

    document.body.style.removeProperty(`--lang-${oldLanguage}`);

    if (newLanguageValue !== "default") {
      document.body.style.setProperty(`--lang-${newLanguageValue}`, "none");
    }
  });
}

function handleCopiedElementChange(callbacks: Callbacks): void {
  callbacks.onAfterNext.push(({ action }) => {
    const oldCopiedStyles = localStorage.getItem("copiedStyles");
    const newCopiedStyles = JSON.stringify(Obj.readKey("value")(action));

    if (oldCopiedStyles !== newCopiedStyles) {
      localStorage.setItem("copiedStyles", newCopiedStyles);
    }
  });
}

function handleHistoryChange(callbacks: Callbacks): void {
  callbacks.onAfterNext.push(({ state, store, config: _config }) => {
    const { currSnapshot, prevSnapshot } = historySelector(
      state as ReduxStateWithHistory
    );
    const currStyleId = currSnapshot?.currentStyleId;
    const prevStyleId = prevSnapshot?.currentStyleId;
    const currStyle = currSnapshot?.currentStyle;
    const prevStyle = prevSnapshot?.currentStyle;

    if (currStyleId !== prevStyleId || currStyle !== prevStyle) {
      const { colorPalette, fontStyles: _fontStyles } =
        currentStyleSelector(state);
      const config = _config.getConfig();

      const richTextColor = document.querySelector("#brz-rich-text-colors");
      const globalColor = document.querySelector("#brz-global-colors");
      const globalFontStyles = document.querySelector("#brz-typography-styles");

      if (richTextColor) {
        richTextColor.innerHTML = makeRichTextColorPaletteCSS(
          colorPalette,
          config
        );
      }

      if (globalColor) {
        globalColor.innerHTML = makeGlobalStylesColorPalette(
          colorPalette,
          config
        );
      }

      if (globalFontStyles) {
        const extraFontStyles = extraFontStylesSelector(state);
        const fontStyles = [..._fontStyles, ...extraFontStyles];
        globalFontStyles.innerHTML = makeGlobalStylesTypography({
          fontStyles,
          store: store as Store,
          config
        });
      }
    }
  });
}

function handleBeforeUnload(e: BeforeUnloadEvent): void {
  e.preventDefault();
  e.returnValue = "Do you really want to close?";
}

function diffFonts(oldFonts: Fonts, fonts: Fonts): DiffFontResult[] {
  return Object.entries(fonts).reduce((acc, [type, fontData]) => {
    if (!fontData || !("data" in fontData)) {
      return acc;
    }

    const oldFont = oldFonts[type as keyof Fonts];

    if (!oldFont) {
      return [...acc, { type, fonts: fontData.data } as DiffFontResult];
    }

    if ("data" in oldFont && oldFont.data !== fontData.data) {
      const diffResult = difference(fontData.data, oldFont.data as Font[]);
      return [...acc, { type, fonts: diffResult } as DiffFontResult];
    }

    return acc;
  }, [] as DiffFontResult[]);
}
