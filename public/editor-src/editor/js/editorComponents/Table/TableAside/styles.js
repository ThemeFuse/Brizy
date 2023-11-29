import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&.brz-table__th.brz-table__aside": {
      standart: ["cssStyleElementTableHeaderWidth"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
