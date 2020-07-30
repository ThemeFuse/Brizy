import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover .brz-ed-box__resizer": {
      standart: ["cssStyleSizeWidth"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
