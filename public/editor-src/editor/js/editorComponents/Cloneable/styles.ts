import { ElementModel } from "visual/component/Elements/Types";
import { isEditor, isView } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const { renderContext } = data.contexts;

  const styles: Styles = {
    ".brz &&": {
      interval: [
        "cssStyleCustomPosition",
        "cssStyleCustomWidth",
        "cssStyleOffset"
      ],
      standart: ["cssStyleZIndex", "cssStylePositionRelative", "cssStyleMargin"]
    },
    ".brz &&:hover": {
      interval: [
        "cssStyleDisplayFlex",
        "cssStyleVisibleMode|||preview",
        "cssStyleVisibleEditorDisplayNoneOrFlex|||editor"
      ]
    }
  };

  if (isView(renderContext)) {
    styles[".brz &&"].standart?.push(
      "cssStyleFlexHorizontalAlign",
      "cssStylePaddingFourFields",
      "cssStyleElementCloneableGap"
    );
  }

  return renderStyles({ ...data, styles });
}

export function styleContainer(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const { renderContext } = data.contexts;

  const styles: Styles = {
    ".brz &&": {
      standart: [
        "cssStyleFlexHorizontalAlign",
        "cssStylePaddingFourFields",
        "cssStyleElementCloneableGap"
      ]
    }
  };

  if (isEditor(renderContext)) {
    styles[".brz &&"].interval = ["cssStyleVisibleMode|||editor"];
  }

  return renderStyles({ ...data, styles });
}

export function styleAnimation(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: ["cssStyleAnimationAll"]
    }
  };

  return renderStyles({ ...data, styles });
}
