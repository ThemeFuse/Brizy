/**
 * Overide index.export.ts because they importad Shopify, Ecwid, MinistryBrands
 * Editor Components Export Manifest
 * Defines all editor components with their selectors and export functions
 */
import { ComponentExport } from "visual/types";
import { makeDataAttrString } from "visual/utils/i18n/attribute";

export const editorComponentsManifest: Record<string, ComponentExport> = {
  accordion: {
    selector: ".brz-accordion",
    export: () => import("./Accordion/export")
  },

  alert: {
    selector: ".brz-alert",
    export: () => import("./Alert/export")
  },

  audio: {
    selector: ".brz-audio",
    export: () => import("./Audio/export")
  },

  countdown: {
    selector: ".brz-countdown",
    export: () => import("./Countdown/export.js")
  },

  countdown2: {
    selector: ".brz-countdown2",
    export: () => import("./Countdown2/export.js")
  },

  counter: {
    selector: ".brz-counter",
    export: () => import("./Counter/export")
  },

  form: {
    selector: makeDataAttrString({ name: "form-version", value: "'1'" }),
    export: () => import("./Form/export.js")
  },

  form2: {
    selector: makeDataAttrString({ name: "form-version", value: "'2'" }),
    export: () => import("./Form2/export")
  },

  fileUpload: {
    selector: ".brz-input__upload",
    export: () => import("./Form2/Form2Field/types/FileUpload/export.js")
  },

  image: {
    selector: ".brz-image__lightbox, .brz-image__gallery-lightbox",
    export: () => import("./Image/export")
  },

  login: {
    selector: ".brz-login",
    export: () => import("./Login/export")
  },

  map: {
    selector: ".brz-map",
    export: () => import("./Map/export")
  },

  progressBar: {
    selector: ".brz-progress-bar",
    export: () => import("./ProgressBar/export")
  },

  protected: {
    selector: ".brz-protected-form",
    export: () => import("./ProtectedPage/export")
  },

  resetPassword: {
    selector: ".brz-reset-psw",
    export: () => import("./ResetPassword/export")
  },

  section: {
    selector: ".brz-slick-slider__section",
    export: () => import("./Section/export")
  },

  sectionPopup: {
    selector: ".brz-popup",
    export: () => import("./SectionPopup/export.js")
  },

  sectionPopup2: {
    selector: ".brz-popup2",
    export: () => import("./SectionPopup2/export.js")
  },

  story: {
    selector: ".brz-slick-slider__story",
    export: () => import("./Story/export")
  },

  tabs: {
    selector: ".brz-tabs",
    export: () => import("./Tabs/export.js")
  },

  translation: {
    selector: ".brz-translation",
    export: () => import("./Translation/export")
  },

  video: {
    selector:
      ".brz-video, .brz-custom-video, .brz-vimeo-video, .brz-youtube-video, .brz-video__lightbox",
    export: () => import("./Video/export.js")
  },

  shareButton: {
    selector: ".brz-shareButton__item",
    export: () => import("./ShareButton/export")
  }
};
