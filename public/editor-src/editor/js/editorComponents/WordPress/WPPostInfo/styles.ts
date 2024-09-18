import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./toolbar";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    ".brz &&:hover .brz-wp__postinfo .brz-li": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms",
        "cssStyleColor",
        "cssStyleElementPostInfoSpacing"
      ]
    },
    ".brz &&:hover .brz-wp__postinfo .brz-icon-svg": {
      standart: ["cssStyleElementPostInfoColorIcons"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
