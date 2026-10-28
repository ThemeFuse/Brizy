import { breakpointsSchema } from "./schemas";

/** The default arrows, built when the markup carries no `data-arrows`. */
export const DEFAULT_PREV_ARROW =
  '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>';
export const DEFAULT_NEXT_ARROW =
  '<button class="slick-next" aria-label="Next" type="button">Next</button>';

const PLAY_ICON_SELECTOR = ":scope > .brz-icon-svg.button-play";
const PAUSE_ICON_SELECTOR = ":scope > .brz-icon-svg.button-pause";

const cloneElement = (element: Element): Element | undefined => {
  const clone = element.cloneNode(true);

  return clone instanceof Element ? clone : undefined;
};

export const makePausePlayItem = (node: Element): HTMLElement | undefined => {
  const playIcon = node.querySelector(PLAY_ICON_SELECTOR);
  const pauseIcon = node.querySelector(PAUSE_ICON_SELECTOR);

  if (!playIcon || !pauseIcon) {
    return undefined;
  }

  const clonedPauseIcon = cloneElement(pauseIcon);
  const clonedPlayIcon = cloneElement(playIcon);

  if (!clonedPauseIcon || !clonedPlayIcon) {
    return undefined;
  }

  clonedPauseIcon.classList.remove("brz-hidden");

  const listItem = document.createElement("li");
  listItem.className = "brz-slick-slider__pause";

  listItem.appendChild(clonedPauseIcon);
  listItem.appendChild(clonedPlayIcon);

  return listItem;
};

export const attachSliderControls = (
  node: Element,
  onClickPause: () => void,
  onClickPlay: () => void
): void => {
  const pauseBtn = node.querySelector<HTMLElement>(
    ".brz-icon-svg.button-pause"
  );
  const playBtn = node.querySelector<HTMLElement>(".brz-icon-svg.button-play");

  if (!pauseBtn || !playBtn) {
    return;
  }

  pauseBtn.addEventListener("click", () => {
    pauseBtn.classList.add("brz-hidden");
    playBtn.classList.remove("brz-hidden");
    onClickPause();
  });

  playBtn.addEventListener("click", () => {
    playBtn.classList.add("brz-hidden");
    pauseBtn.classList.remove("brz-hidden");
    onClickPlay();
  });
};

/** Appends `node` to every target: the last gets the node, the others a deep copy. */
export const appendToEach = (targets: Element[], node: Node): void => {
  targets.forEach((target, index) => {
    target.appendChild(
      index === targets.length - 1 ? node : node.cloneNode(true)
    );
  });
};

const BRACES = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;

/** jQuery's `getData`: `"true"` / `"false"` / `"null"`, numbers and JSON become values. */
function dataValue(value: string): unknown {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  if (value === "null") {
    return null;
  }
  if (value === `${Number(value)}`) {
    return Number(value);
  }
  if (BRACES.test(value)) {
    try {
      const parsed: unknown = JSON.parse(value);

      return parsed;
    } catch {
      return value;
    }
  }
  return value;
}

const camelCase = (name: string): string =>
  name
    .replace(/^-ms-/, "ms-")
    .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

/** Every `data-*` attribute of `element`, camel-cased and converted. */
export function readDataAttributes(element: Element): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  Array.from(element.attributes).forEach(({ name, value }) => {
    if (name.startsWith("data-")) {
      data[camelCase(name.slice(5))] = dataValue(value);
    }
  });

  return data;
}

/** The breakpoints in `data-responsive` (URI-encoded JSON); throws on an invalid value. */
export const readBreakpoints = (value: unknown) =>
  breakpointsSchema.parse(JSON.parse(decodeURIComponent(String(value))));
