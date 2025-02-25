import { ElementModel } from "visual/component/Elements/Types";
import { isEditor, isView } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const { renderContext } = data.contexts;
  const styles = {
    ".brz &&:hover": {
      standart: isView(renderContext)
        ? [
            "cssStyleSizeWidth",
            "cssStylePaddingBG",
            "cssStyleBgColor",
            "cssStyleBgGradient",
            "cssStyleBorder",
            "cssStyleBorderRadius",
            "cssStyleBoxShadow"
          ]
        : ["cssStyleSizeWidth"]
    },
    ".brz &&:hover .brz-woo-page": {
      standart: isEditor(renderContext)
        ? [
            "cssStylePaddingBG",
            "cssStyleBgColor",
            "cssStyleBgGradient",
            "cssStyleBorder",
            "cssStyleBorderRadius",
            "cssStyleBoxShadow"
          ]
        : []
    }
  };

  return renderStyles({ ...data, styles });
}
