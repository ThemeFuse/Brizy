import { height, setContentSize, width } from "../dimensions";
import { CustomVideo } from "./customVideo";
import type { Player, VideoSettings } from "./types";
import { Vimeo } from "./vimeo";
import { Youtube } from "./youtube";

export type { VideoSettings } from "./types";

// A background video is an over-sized cover behind `.brz-bg`: the element is whatever the layout
// gives it, and the iframe inside is stretched to a 16:9 box centred on it. Which backend drives
// playback follows the `type` the markup or the editor's model carries.
//
// Ported from the in-house jQuery plugin, behaviour for behaviour. Two of its quirks are kept on
// purpose (BRZ-1391 rewrites, it does not fix): `destroy` leaves the element registered, so a
// later init on the same node is ignored, and `reinit` tears the resize listener down without
// putting it back.

const RATIO = 1.78;

interface Size {
  width: number;
  height: number;
  left: number;
  top: number;
}

// "queried" holds what the element had when it was last looked at — possibly nothing; "cleared" is
// what `destroy` leaves behind, and the only state that makes the plugin look again.
type IframeState =
  | { kind: "queried"; iframe: HTMLIFrameElement | undefined }
  | { kind: "cleared" };

const instances = new WeakMap<HTMLElement, BackgroundVideo>();

/** Starts a background video on an element, unless one is already registered for it. */
export function initBackgroundVideo(
  element: HTMLElement,
  settings: VideoSettings
): void {
  if (!instances.has(element)) {
    instances.set(element, new BackgroundVideo(element, settings));
  }
}

/** Tears the player down. The element stays registered, exactly as it did before. */
export function destroyBackgroundVideo(element: HTMLElement): void {
  instances.get(element)?.destroy();
}

/** Re-fits the iframe over the element. */
export function resizeBackgroundVideo(element: HTMLElement): void {
  instances.get(element)?.resize();
}

/** Destroys the player and builds a new one, without re-fitting the iframe. */
export function reinitBackgroundVideo(
  element: HTMLElement,
  settings: VideoSettings
): void {
  instances.get(element)?.reinit(settings);
}

/** Swaps the backend in place, keeping the element registered, and re-fits the iframe. */
export function typeChangeBackgroundVideo(
  element: HTMLElement,
  settings: VideoSettings
): void {
  instances.get(element)?.typeChange(settings);
}

export function playBackgroundVideo(element: HTMLElement): void {
  instances.get(element)?.player().play();
}

export function pauseBackgroundVideo(element: HTMLElement): void {
  instances.get(element)?.player().pause();
}

export function setBackgroundVideoLoop(
  element: HTMLElement,
  loop: boolean | undefined
): void {
  instances.get(element)?.player().setLoop(loop);
}

export function seekBackgroundVideo(
  element: HTMLElement,
  seconds: number | string | undefined
): void {
  instances.get(element)?.player().seekTo(seconds);
}

class BackgroundVideo {
  private readonly element: HTMLElement;
  private iframeState: IframeState;
  private currentPlayer: Player | undefined;

  private readonly onResize = (): void => {
    this.setSizes();
  };

  constructor(element: HTMLElement, settings: VideoSettings) {
    this.element = element;
    this.iframeState = {
      kind: "queried",
      iframe: element.querySelector("iframe") ?? undefined
    };

    this.setSizes();
    window.addEventListener("resize", this.onResize);
    this.init(settings);
  }

  /** The active player. Reaching for it after `destroy` throws, as it always has. */
  player(): Player {
    if (!this.currentPlayer) {
      throw new TypeError("the background video has no player");
    }

    return this.currentPlayer;
  }

  resize(): void {
    this.setSizes();
  }

  typeChange(settings: VideoSettings): void {
    this.player().destroy();
    this.init(settings);
    this.setSizes();
  }

  reinit(settings: VideoSettings): void {
    this.destroy();
    this.init(settings);
  }

  destroy(): void {
    window.removeEventListener("resize", this.onResize);
    this.player().destroy();
    this.iframeState = { kind: "cleared" };
    this.currentPlayer = undefined;
  }

  private init(settings: VideoSettings): void {
    if (this.iframeState.kind === "cleared") {
      this.iframeState = {
        kind: "queried",
        iframe: this.element.querySelector("iframe") ?? undefined
      };
    }

    const { iframe } = this.iframeState;

    switch (settings.type) {
      case "youtube":
        this.currentPlayer = new Youtube(iframe, settings);
        break;
      case "vimeo":
        this.currentPlayer = new Vimeo(iframe, settings);
        break;
      default:
        this.currentPlayer = new CustomVideo(this.element, settings);
    }
  }

  private setSizes(): void {
    const size = this.measure();

    if (this.iframeState.kind === "cleared") {
      return;
    }

    const { iframe } = this.iframeState;

    if (!iframe) {
      return;
    }

    setContentSize(iframe, "width", size.width);
    setContentSize(iframe, "height", size.height);
    iframe.style.left = `${size.left}px`;
    iframe.style.top = `${size.top}px`;
  }

  private measure(): Size {
    const adminBar = document.getElementById("wpadminbar");

    // This is needed for check preview height section
    if (adminBar) {
      adminBar.style.display = "none";
    }

    const elementWidth = width(this.element);
    const elementHeight = height(this.element);

    if (adminBar) {
      adminBar.style.removeProperty("display");
    }

    if (elementWidth / RATIO < elementHeight) {
      const coverWidth = Math.ceil(elementHeight * RATIO);

      return {
        width: coverWidth,
        height: elementHeight,
        left: (elementWidth - coverWidth) / 2,
        top: 0
      };
    }

    const coverHeight = Math.ceil(elementWidth / RATIO);

    return {
      width: elementWidth,
      height: coverHeight,
      left: 0,
      top: (elementHeight - coverHeight) / 2
    };
  }
}
