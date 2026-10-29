/**
 * Framework Components Export Manifest
 * Defines all framework components with their selectors and export functions
 */

import type { ComponentExport } from "visual/types";

export const componentsManifest: Record<string, ComponentExport> = {
  animation: {
    selector: ".brz-animated",
    export: () => import("./Animation/export.js")
  },

  hoverAnimation: {
    selector: ".brz-hover-animation__container",
    export: () => import("./HoverAnimation/export")
  },

  animatedHeadline: {
    selector: ".brz-animatedHeadline--wrapper",
    export: () => import("./AnimatedHeadline/export")
  },

  background: {
    selector: ".brz-bg-image-parallax, .brz-bg-video, .brz-bg-slideshow",
    export: () => import("./Background/export")
  },

  comments: {
    selector: "#disqus_thread",
    export: () => import("./Comments/export.js")
  },

  select: {
    selector: ".brz-control__select",
    export: () => import("./Controls/Select/export.js")
  },

  facebook: {
    selector: ".brz-facebook",
    export: () => import("./Facebook/export")
  },

  link: {
    selector: ".brz-anchor, .link--anchor, .link--external",
    export: () => import("./Link/export")
  },

  twitter: {
    selector: ".brz-twitter",
    export: () => import("./Twitter/export")
  }
};
