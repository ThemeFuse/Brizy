import { ElementModel } from "visual/component/Elements/Types";
import { isView } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const { renderContext } = data.contexts;

  const isPreview = isView(renderContext);

  const styles = {
    ".brz &&": {
      standart: isPreview
        ? ["cssStyleSizeWidth", "cssStylePaddingBG", "cssStyleBorderRadius"]
        : ["cssStyleSizeWidth"]
    },
    ".brz &&:hover": {
      standart: isPreview
        ? [
            "cssStyleBgColor",
            "cssStyleBgGradient",
            "cssStyleBorder",
            "cssStyleBoxShadow"
          ]
        : []
    },
    ".brz && .brz-woo-page": {
      standart: !isPreview ? ["cssStylePaddingBG", "cssStyleBorderRadius"] : []
    },
    ".brz &&:hover .brz-woo-page": {
      standart: !isPreview
        ? [
            "cssStyleBgColor",
            "cssStyleBgGradient",
            "cssStyleBorder",
            "cssStyleBoxShadow"
          ]
        : []
    }
  };

  return renderStyles({ ...data, styles });
}
