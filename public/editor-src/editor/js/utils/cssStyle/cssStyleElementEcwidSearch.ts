import { cssStyleBgColor } from "visual/utils/cssStyle/cssStyleBgColor";
import { cssStyleBgGradient } from "visual/utils/cssStyle/cssStyleBgGradient";
import { cssStyleBorder } from "visual/utils/cssStyle/cssStyleBorder";
import { ACTIVE, NORMAL } from "visual/utils/stateMode";
import { CSSValue } from "visual/utils/style2/types";

export const cssStyleElementEcwidSearchCheckboxesBg = (
  data: CSSValue
): string => cssStyleBgColor({ ...data, prefix: "checkboxesBg" });

export const cssStyleElementEcwidSearchCheckboxesGradient = (
  data: CSSValue
): string => cssStyleBgGradient({ ...data, prefix: "checkboxes" });

export const cssStyleElementEcwidSearchCheckboxesBorder = (
  data: CSSValue
): string => cssStyleBorder({ ...data, prefix: "checkboxes" });

export const cssStyleElementEcwidSearchCheckboxesActiveBg = (
  data: CSSValue
): string =>
  cssStyleBgColor({ ...data, state: ACTIVE, prefix: "checkboxesBg" });

export const cssStyleElementEcwidSearchCheckboxesActiveGradient = (
  data: CSSValue
): string =>
  cssStyleBgGradient({ ...data, state: ACTIVE, prefix: "checkboxes" });

export const cssStyleElementEcwidSearchCheckboxesActiveBorder = (
  data: CSSValue
): string => cssStyleBorder({ ...data, state: ACTIVE, prefix: "checkboxes" });

export const cssStyleElementEcwidSearchRadioBorder = (data: CSSValue): string =>
  cssStyleBorder({ ...data, prefix: "radio" });

export const cssStyleElementEcwidSearchRadioActiveBg = (
  data: CSSValue
): string => cssStyleBgColor({ ...data, state: NORMAL, prefix: "radioBg" });

export const cssStyleElementEcwidSearchRadioActiveGradient = (
  data: CSSValue
): string => cssStyleBgGradient({ ...data, state: NORMAL, prefix: "radio" });

export const cssStyleElementEcwidSearchRadioActiveBorder = (
  data: CSSValue
): string => cssStyleBorder({ ...data, state: NORMAL, prefix: "radio" });
