const PLAY_ICON_SELECTOR = ":scope > .brz-icon-svg.button-play";
const PAUSE_ICON_SELECTOR = ":scope > .brz-icon-svg.button-pause";

export const makePausePlayItem = (node: Element): HTMLElement | null => {
  const playIcon = node.querySelector(PLAY_ICON_SELECTOR);
  const pauseIcon = node.querySelector(PAUSE_ICON_SELECTOR);

  if (!playIcon || !pauseIcon) {
    return null;
  }

  pauseIcon.classList.remove("brz-hidden");

  const listItem = document.createElement("li");
  listItem.className = "brz-slick-slider__pause";

  listItem.appendChild(pauseIcon);
  listItem.appendChild(playIcon);

  return listItem;
};

type CB = (node: Element) => void;

export const attachSliderControls = (
  $this: Element,
  node: Element,
  onClickPause: CB,
  onClickPlay: CB
): void => {
  const pauseBtn = node.querySelector<HTMLElement>(
    ".brz-icon-svg.button-pause"
  );
  const playBtn = node.querySelector<HTMLElement>(".brz-icon-svg.button-play");

  if (!pauseBtn || !playBtn) {
    return;
  }

  pauseBtn.addEventListener("click", function () {
    pauseBtn.classList.add("brz-hidden");
    playBtn.classList.remove("brz-hidden");
    onClickPause($this);
  });

  playBtn.addEventListener("click", function () {
    playBtn.classList.add("brz-hidden");
    pauseBtn.classList.remove("brz-hidden");
    onClickPlay($this);
  });
};
