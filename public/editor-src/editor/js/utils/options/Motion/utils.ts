import { FromElementModelGetter } from "visual/component/Options/Type";
import { t } from "visual/utils/i18n";
import { Effect } from "./types/Value";

export const effectIcon = (effect: Effect): string => {
  switch (effect) {
    case "blur":
      return "nc-blur";
    case "horizontal":
      return "nc-scroll-horizontal";
    case "mouseTrack":
      return "nc-mouse";
    case "rotate":
      return "nc-captcha";
    case "scale":
      return "nc-scroll-scale";
    case "mouseTilt":
      return "nc-cube";
    case "transparency":
      return "nc-scroll-transparency";
    case "vertical":
      return "nc-scroll-vertical";
  }
};

export const effectTitle = (effect: Effect): string => {
  switch (effect) {
    case "blur":
      return t("Blur");
    case "mouseTrack":
      return t("MouseTrack");
    case "rotate":
      return t("Rotate");
    case "scale":
      return t("Scale");
    case "horizontal":
      return t("Horizontal");
    case "mouseTilt":
      return t("3D Tilt");
    case "transparency":
      return t("Transparency");
    case "vertical":
      return t("Vertical");
  }
};

export const isEnabled = (get: FromElementModelGetter): boolean =>
  !!get("enabled");
