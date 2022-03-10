import { renderStyles } from "visual/utils/cssStyle";

export function styleSection(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      interval: ["cssStyleDisplayBlock"]
    },
    ".brz &&:hover .brz-section__content": {
      standart: ["cssStyleDisplayFlex"]
    },
    ".brz && .brz-slick-slider__dots > li:first-child.slick-active::after": {
      standart: ["cssStyleStoryFristSlideProgress"]
    },
    ".brz && .brz-slick-slider__dots > li.slick-active::after": {
      standart: ["cssStyleStoryProgress"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
