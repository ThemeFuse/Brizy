import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { getColor } from "visual/utils/color";
import type { OptionStyle } from "visual/utils/cssStyle/types";

export const barSelector = "{{WRAPPER}} .brz-cookie-banner__bar";
export const badgeSelector = "{{WRAPPER}} .brz-cookie-banner__badge";
export const dialogSelector = "{{WRAPPER}} .brz-cookie-banner__dialog";
export const dialogFooterSelector =
  "{{WRAPPER}} .brz-cookie-banner__dialog-footer";
export const switchSliderSelector =
  "{{WRAPPER}} .brz-cookie-banner__switch-input:checked ~ .brz-cookie-banner__switch-slider";

const bgColorAt =
  (config: ConfigCommon, selector: string): OptionStyle<"colorPicker"> =>
  ({ value: { palette, hex, opacity } }) => {
    const color = getColor(palette, hex, opacity, config);

    if (color) {
      return { [selector]: { "background-color": color } };
    }
  };

const textColorAt =
  (config: ConfigCommon, selector: string): OptionStyle<"colorPicker"> =>
  ({ value: { palette, hex, opacity } }) => {
    const color = getColor(palette, hex, opacity, config);

    if (color) {
      return { [selector]: { color } };
    }
  };

//#region bar
export const barColorCSS = (config: ConfigCommon): OptionStyle<"colorPicker"> =>
  bgColorAt(config, barSelector);

export const barPaddingCSS: OptionStyle<"padding"> = ({ meta, value }) => {
  const { top, topUnit, right, rightUnit, bottom, bottomUnit, left, leftUnit } =
    value;
  const { isEmpty, isNoEmptyGrouped } = meta ?? {};

  const padding = isEmpty
    ? "0"
    : isNoEmptyGrouped
      ? `${top}${topUnit}`
      : `${top}${topUnit} ${right}${rightUnit} ${bottom}${bottomUnit} ${left}${leftUnit}`;

  return { [barSelector]: { padding } };
};
//#endregion

//#region buttons
// Every button is styled on its own, through the BEM modifier of
// `.brz-cookie-banner__btn` (`--accept`, `--reject`, ...); the shared geometry
// lives on `__btn` itself in the SCSS.
export const buttonSelector = (modifier: string): string =>
  `{{WRAPPER}} .brz-cookie-banner__btn--${modifier}`;

export const buttonBgColorCSS = (
  config: ConfigCommon,
  modifier: string
): OptionStyle<"colorPicker"> => bgColorAt(config, buttonSelector(modifier));

export const buttonTextColorCSS = (
  config: ConfigCommon,
  modifier: string
): OptionStyle<"colorPicker"> => textColorAt(config, buttonSelector(modifier));

export const buttonBorderRadiusTypeCSS =
  (modifier: string): OptionStyle<"radioGroup"> =>
  ({ value: { value } }) => {
    switch (value) {
      case "square":
        return { [buttonSelector(modifier)]: { "border-radius": "0" } };
      case "rounded":
        return { [buttonSelector(modifier)]: { "border-radius": "100px" } };
      default:
        // "custom" falls through to the slider below
        return undefined;
    }
  };

export const buttonBorderRadiusCSS =
  (modifier: string): OptionStyle<"slider"> =>
  ({ value: { value, unit } }) => ({
    [buttonSelector(modifier)]: { "border-radius": `${value}${unit}` }
  });

// Button-element parity: same px table as getButtonSizes() in
// utils/cssStyle/cssStyleSize.ts (small/medium/large -> padding TB/RL).
export const buttonSizeCSS =
  (modifier: string): OptionStyle<"radioGroup"> =>
  ({ value: { value } }) => {
    switch (value) {
      case "small":
        return { [buttonSelector(modifier)]: { padding: "11px 26px" } };
      case "medium":
        return { [buttonSelector(modifier)]: { padding: "14px 42px" } };
      case "large":
        return { [buttonSelector(modifier)]: { padding: "19px 44px" } };
      default:
        // "custom" falls through to the two sliders below
        return undefined;
    }
  };

export const buttonPaddingRLCSS =
  (modifier: string): OptionStyle<"slider"> =>
  ({ value: { value, unit } }) => ({
    [buttonSelector(modifier)]: {
      "padding-left": `${value}${unit}`,
      "padding-right": `${value}${unit}`
    }
  });

export const buttonPaddingTBCSS =
  (modifier: string): OptionStyle<"slider"> =>
  ({ value: { value, unit } }) => ({
    [buttonSelector(modifier)]: {
      "padding-top": `${value}${unit}`,
      "padding-bottom": `${value}${unit}`
    }
  });
//#endregion

//#region badge
export const badgeBgColorCSS = (
  config: ConfigCommon
): OptionStyle<"colorPicker"> => bgColorAt(config, badgeSelector);

export const badgeIconColorCSS = (
  config: ConfigCommon
): OptionStyle<"colorPicker"> => textColorAt(config, badgeSelector);

export const badgePositionCSS: OptionStyle<"radioGroup"> = ({
  value: { value }
}) => {
  const position: Record<string, string> =
    value === "bottomLeft" ? { left: "20px" } : { right: "20px" };

  return { [badgeSelector]: position };
};
//#endregion

//#region dialog
export const dialogBgColorCSS = (
  config: ConfigCommon
): OptionStyle<"colorPicker"> => bgColorAt(config, dialogSelector);

export const dialogTextColorCSS = (
  config: ConfigCommon
): OptionStyle<"colorPicker"> => textColorAt(config, dialogSelector);

export const dialogPaddingCSS: OptionStyle<"padding"> = ({ meta, value }) => {
  const { top, topUnit, right, rightUnit, bottom, bottomUnit, left, leftUnit } =
    value;
  const { isEmpty, isNoEmptyGrouped } = meta ?? {};

  const padding = isEmpty
    ? "0"
    : isNoEmptyGrouped
      ? `${top}${topUnit}`
      : `${top}${topUnit} ${right}${rightUnit} ${bottom}${bottomUnit} ${left}${leftUnit}`;

  return { [dialogSelector]: { padding } };
};

// Both dialog buttons share this one option (see the toolbar files); it moves
// them together by laying out their common flex footer.
export const dialogButtonsAlignCSS: OptionStyle<"toggle"> = ({
  value: { value }
}) => {
  const justify =
    value === "left"
      ? "flex-start"
      : value === "center"
        ? "center"
        : "flex-end";

  return { [dialogFooterSelector]: { "justify-content": justify } };
};
//#endregion

//#region switch
export const switchColorCSS = (
  config: ConfigCommon
): OptionStyle<"colorPicker"> => bgColorAt(config, switchSliderSelector);
//#endregion
