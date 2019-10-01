import { renderStyles } from "visual/utils/cssStyle";

export function styleSection(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      interval: [
        "cssStyleDisplayBlock",
        "cssStyleVisibleMode|||preview",
        "cssStyleVisibleEditorDisplayNoneOrBlock|||editor"
      ]
    },
    ".brz &&:hover .brz-container__wrap": {
      interval: ["cssStyleVisibleMode|||editor"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
