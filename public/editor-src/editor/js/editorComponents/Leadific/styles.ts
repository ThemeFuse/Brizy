import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&": {
      standart: ["cssStyleFlexHorizontalAlign"]
    },
    ".brz && .brz-leadific__content": {
      standart: ["getAllCssStyleTypography"]
    },
    ".brz &&:hover .brz-leadific__content": {
      standart: ["cssStyleColor", "cssStyleStrokeText", "cssStyleTextShadow2"],
      interval: ["cssStyleHoverTransition"]
    }
  };

  return renderStyles({ ...data, styles });
}
