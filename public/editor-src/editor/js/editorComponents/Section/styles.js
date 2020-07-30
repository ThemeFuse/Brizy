import { renderStyles } from "visual/utils/cssStyle";

export function styleSection(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleZIndex", "cssStyleMargin"],
      interval: [
        "cssStyleDisplayBlock",
        "cssStyleVisibleMode|||preview",
        "cssStyleVisibleEditorDisplayNoneOrBlock|||editor"
      ]
    },
    ".brz &&:hover .brz-container__wrap": {
      interval: ["cssStyleVisibleMode|||editor", "cssStyleFlexVerticalAlign"]
    },
    ".brz &&:hover .brz-section__content": {
      standart: ["cssStyleSectionHeightStyle"]
    },
    ".brz && > .slick-slider > .brz-slick-slider__dots:hover": {
      standart: ["cssStyleSectionColorDots"]
    },
    ".brz && > .slick-slider > .brz-slick-slider__arrow:hover": {
      standart: ["cssStyleSectionColorArrows"]
    }
  };

  if (IS_EDITOR) {
    // Added offset for toolbar when uses marginTop in negative value
    styles[".brz &&:hover .brz-ed-collapsible"] = {
      standart: ["cssStyleSectionToolbarOffset"]
    };
  }

  return renderStyles({ v, vs, vd, styles });
}

export function styleAnimation(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleAnimation",
        "cssStyleAnimationDuration",
        "cssStyleAnimationDelay"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
