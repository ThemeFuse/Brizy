import { Styles } from "visual/utils/cssStyle/types";

export const getTooltipStyles = (): Styles => ({
  ".brz &&.brz-tooltip": {
    standart: [
      "cssStyleOptionTooltipWidth",
      "cssStyleOptionTooltipBgColor",
      "cssStyleOptionTooltipBgGradient",
      "cssStyleOptionTooltipColor",
      "cssStyleOptionTooltipBorder",
      "cssStyleOptionTooltipShadow",
      "cssStyleOptionTooltipTypography",
      "cssStyleOptionTooltipHorizontalAlign",
      "cssStyleOptionTooltipBorderRadius",
      "cssStyleOptionTooltipPadding"
    ]
  },
  ".brz &&.brz-tooltip[data-popper-placement*='top'] .brz-tooltip--arrow": {
    standart: ["cssStyleOptionTooltipArrowTopColor"]
  },
  ".brz &&.brz-tooltip[data-popper-placement*='bottom'] .brz-tooltip--arrow": {
    standart: ["cssStyleOptionTooltipArrowBottomColor"]
  },
  ".brz &&.brz-tooltip[data-popper-placement*='right'] .brz-tooltip--arrow": {
    standart: ["cssStyleOptionTooltipArrowRightColor"]
  },
  ".brz &&.brz-tooltip[data-popper-placement*='left'] .brz-tooltip--arrow": {
    standart: ["cssStyleOptionTooltipArrowLeftColor"]
  }
});
