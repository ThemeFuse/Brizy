import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./index";

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
      standart: ["cssStyleSizeWidth", "cssStyleSizeHeightPxOnly"]
    },
    ".brz &&:hover .calendly-inline-widget": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleBorder",
        "cssStyleBoxShadow",
        "cssStyleElementCalendlyPadding"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
