import { renderStyles } from "visual/utils/cssStyle";
import { ElementModel } from "visual/component/Elements/Types";

export function styleWrapper(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): [string, string, string] {
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

  return renderStyles({ v, vs, vd, styles });
}

export { styleAnimation } from "visual/editorComponents/Wrapper/styles";
