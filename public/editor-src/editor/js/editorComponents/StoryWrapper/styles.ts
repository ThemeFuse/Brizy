import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function styleWrapper(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&:hover": {
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
