import type { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&.brz-twitter__embed": {
      standart: ["cssStyleSizeWidth", "cssStyleSizeHeight"]
    }
  };

  return renderStyles({ ...data, styles });
}
