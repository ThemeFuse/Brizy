import { renderStyles } from "visual/utils/cssStyle";

export function styleSection(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      interval: [
        "cssStyleDisplayBlock",
        "cssStyleVisibleMode|||preview",
        "cssStyleVisibleEditorDisplayNoneOrBlock|||editor"
      ]
    }
  };

  if (IS_EDITOR) {
    styles[".brz &&:hover"].interval.push("cssStyleShowMembershipBlock");

    styles[".brz &&:hover .brz-container"] = {
      interval: ["cssStyleVisibleMode|||editor"]
    };
    styles[".brz &&:hover > .brz-section__menu-item > .brz-bg"] = {
      interval: ["cssStyleVisibleMode|||editor"]
    };
    styles[".brz &&:hover > .brz-section__header-sticky-item > .brz-bg"] = {
      interval: ["cssStyleVisibleMode|||editor"]
    };
  }

  return renderStyles({ v, vs, vd, styles });
}

export function styleAnimation(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleAnimation",
        "cssStyleAnimationDuration",
        "cssStyleAnimationDelay"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
