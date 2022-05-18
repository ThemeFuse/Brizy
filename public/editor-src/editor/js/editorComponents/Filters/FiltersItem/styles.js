import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&.brz-filters__option--style-3 .brz-filters__checkbox-option:hover": {
      standart: [
        "cssStyleElementFiltersCheckboxStyle3BgColor",
        "cssStyleElementFiltersCheckStyle3Border",
        "cssStyleElementFiltersCheckStyle3Shadow"
      ]
    },
    ".brz &&.brz-filters__option--style-4 .brz-filters__checkbox-option:hover": {
      standart: ["cssStyleBgImage", "cssStyleBgImagePosition"]
    },
    ".brz &&.brz-filters__option--style-3 .brz-filters__radio-option:hover": {
      standart: [
        "cssStyleElementFiltersCheckboxStyle3BgColor",
        "cssStyleElementFiltersCheckStyle3Border",
        "cssStyleElementFiltersCheckStyle3Shadow"
      ]
    },
    ".brz &&.brz-filters__option--style-4 .brz-filters__radio-option:hover": {
      standart: ["cssStyleBgImage", "cssStyleBgImagePosition"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
