import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./index";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&.brz-twitter__embed:hover": {
      standart: ["cssStyleSizeWidth", "cssStyleSizeHeight"]
    }
  };

  return renderStyles({ ...data, styles });
}
