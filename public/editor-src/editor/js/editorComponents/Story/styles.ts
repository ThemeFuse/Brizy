import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function styleSection(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
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

  return renderStyles({ ...data, styles });
}
