import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): [string, string, string] {
  const styles = {
    ".brz &&:hover": { standart: ["cssStyleSizeWidth"] },
    ".brz &&:hover .brz-hr": { standart: ["cssStyleLineBorder"] }
  };

  return renderStyles({ v, vs, vd, styles }) as [string, string, string];
}
