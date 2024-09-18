import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export function styleForm(v: Value, vs: Value, vd: Value): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidthStoryOnly"]
    },

    ".brz &&:hover .brz-form": {
      standart: ["cssStyleElementForm2Margin"]
    },

    ".brz && .brz-forms2__item,.brz && .brz-form-ms-buttons": {
      standart: ["cssStyleElementForm2Padding"]
    },

    ".brz &&:hover .brz-forms2__item-button": {
      standart: ["cssStyleMarginAlign", "cssStyleElementForm2SubmitWidth"]
    },

    ".brz &&:hover .brz-forms2-story .brz-btn:before, .brz && .brz-form-ms-buttons--story .brz-btn:before":
      {
        standart: ["cssStyleElementForm2StoryButtonHeight"]
      },

    ".brz && .brz-form-ms-indicators": {
      standart: ["cssStyleElementForm2MSProgressMargin"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
