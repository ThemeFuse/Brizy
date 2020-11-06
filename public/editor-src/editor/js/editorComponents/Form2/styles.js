import { renderStyles } from "visual/utils/cssStyle";

export function styleForm(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidthStoryOnly"]
    },

    ".brz &&:hover .brz-form": {
      standart: ["cssStyleElementForm2Margin"]
    },

    ".brz &&:hover .brz-forms2__item": {
      standart: ["cssStyleElementForm2Padding"]
    },

    ".brz &&:hover .brz-forms2__item-button": {
      standart: ["cssStyleMarginAlign", "cssStyleElementForm2SubmitWidth"]
    },

    ".brz &&:hover .brz-forms2-story .brz-btn:before": {
      standart: ["cssStyleElementForm2StoryButtonHeight"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
