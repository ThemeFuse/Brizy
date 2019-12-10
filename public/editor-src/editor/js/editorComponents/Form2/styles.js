import { renderStyles } from "visual/utils/cssStyle";

export function styleForm(v, vs, vd) {
  const styles = {
    ".brz &&:hover .brz-form": {
      standart: ["cssStyleElementForm2Margin"]
    },

    ".brz &&:hover .brz-forms2__item": {
      standart: ["cssStyleElementForm2Padding"]
    },

    ".brz &&:hover .brz-forms2__item-button": {
      standart: [
        "cssStyleMarginAlign",
        "cssStyleElementForm2SubmitWidth"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
