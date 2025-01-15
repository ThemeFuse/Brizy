import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./types";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": {
      standart: ["cssStyleFlexHorizontalAlign"]
    },
    ".brz &&:hover .brz-leadific__content": {
      standart: [
        "getAllCssStyleTypography",
        "cssStyleColor",
        "cssStyleStrokeText",
        "cssStyleTextShadow2"
      ],
      interval: ["cssStyleHoverTransition"]
    }
  };

  return renderStyles({ ...data, styles });
}
