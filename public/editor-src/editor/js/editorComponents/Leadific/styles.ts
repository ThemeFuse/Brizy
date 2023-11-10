import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./types";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
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

  return renderStyles({ v, vs, vd, styles });
}
