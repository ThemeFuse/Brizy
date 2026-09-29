import type { ElementModel } from "visual/component/Elements/Types";
import type { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle } from "visual/utils/cssStyle/types";

export function styleWrapper(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&": {
      interval: [
        "cssStyleDisplayFlex",
        "cssStyleZIndexStory",
        "cssStyleCustomPosition",
        "cssStyleWrapperFixedFlex",
        "cssStyleRotate"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export { styleAnimation } from "visual/editorComponents/Wrapper/styles";
