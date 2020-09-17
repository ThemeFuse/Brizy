import { renderStyles } from "visual/utils/cssStyle";

export function styleSection(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      interval: ["cssStyleDisplayBlock"]
    },
    ".brz &&:hover .brz-section__content": {
      standart: ["cssStyleDisplayFlex"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
