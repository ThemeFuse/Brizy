import { ElementModel } from "visual/component/Elements/Types";
import { isEditor } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";

export function styleSection(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const { renderContext } = data.contexts;

  const isEditorMode = isEditor(renderContext);

  const styles: Styles = {
    ".brz &&": {
      standart: ["cssStyleZIndex", "cssStyleMargin"],
      interval: ["cssStyleVisibleMode|||preview"]
    },
    ".brz &&:hover": {
      interval: [
        "cssStyleDisplayBlock",
        "cssStyleVisibleEditorDisplayNoneOrBlock|||editor"
      ]
    },
    ".brz &&.brz-section .brz-section__content": {
      standart: ["cssStyleSectionHeightStyle", "cssStyleDisplayFlex"]
    },
    ".brz && .brz-container": {
      standart: ["cssStyleFlexColumnVerticalAlign"],
      ...(isEditorMode
        ? {
            interval: ["cssStyleVisibleMode|||editor"]
          }
        : {})
    },
    ".brz && > .slick-slider > .brz-slick-slider__dots:hover": {
      standart: ["cssStyleSectionColorDots"]
    },
    ".brz && > .slick-slider > .brz-slick-slider__arrow:hover": {
      standart: ["cssStyleSectionColorArrows"]
    }
  };

  if (isEditorMode) {
    // roles need only for editor mode
    // preview works with {{ placeholders }}
    styles[".brz &&:hover"].interval?.push("cssStyleShowBlock");

    // Added offset for toolbar when uses marginTop in negative value
    styles[".brz && .brz-ed-collapsible"] = {
      standart: ["cssStyleSectionToolbarOffset"]
    };
    styles[".brz && .brz-section__content > .brz-bg"] = {
      interval: ["cssStyleVisibleMode|||editor"]
    };
  }

  return renderStyles({ ...data, styles });
}

export function styleAnimation(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleAnimationAll"]
    }
  };

  return renderStyles({ ...data, styles });
}
