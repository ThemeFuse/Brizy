import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./index";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&.brz-twitter__embed": {
      standart: ["cssStyleSizeWidth", "cssStyleSizeHeight"]
    }
  };

  return renderStyles({ ...data, styles });
}
