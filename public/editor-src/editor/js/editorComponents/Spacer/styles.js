import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": { standart: ["cssStyleSizeHeight"] }
  };

  return renderStyles({ v, vs, vd, styles });
}
