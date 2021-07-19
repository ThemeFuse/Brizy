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
    ".brz &&:hover .brz-section__content": {
      standart: ["cssStyleSectionHeightStyle", "cssStyleDisplayFlex"]
    },
    ".brz &&:hover .brz-container": {
      standart: ["cssStyleFlexColumnVerticalAlign"]
    },
    ".brz && > .slick-slider > .brz-slick-slider__dots:hover": {
      standart: ["cssStyleSectionColorDots"]
    },
    ".brz && > .slick-slider > .brz-slick-slider__arrow:hover": {
      standart: ["cssStyleSectionColorArrows"]
    }
  };

  if (IS_EDITOR) {
    // roles need only for editor mode
    // preview works with {{ placeholders }}
    styles[".brz &&:hover"].interval.push("cssStyleShowMembershipBlock");

    // Added offset for toolbar when uses marginTop in negative value
    styles[".brz &&:hover .brz-ed-collapsible"] = {
      standart: ["cssStyleSectionToolbarOffset"]
    };
    styles[".brz &&:hover .brz-container"].interval = [
      "cssStyleVisibleMode|||editor"
    ];
    styles[".brz &&:hover .brz-section__content > .brz-bg"] = {
      interval: ["cssStyleVisibleMode|||editor"]
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
