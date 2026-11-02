import { makeAttr } from "visual/utils/i18n/attribute";

// One loader per bundle: the IFrame API script is injected once and every background video that
// wants a player queues behind it.
//
// The three branches below look redundant and are not: on a published page `window.Brz` exists and
// the handshake goes through it, in the editor it does not and the loader has to flush its own
// queue. `editorComponents/Video/export.js` also installs this global and chains whatever it finds,
// which is why the first branch only fills an empty slot. Kept exactly as it was (BRZ-1391).

const SRC = "https://www.youtube.com/iframe_api";

export interface YoutubePlayer {
  mute: () => void;
  unMute: () => void;
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number | string) => void;
}

export interface YoutubeReadyEvent {
  target: YoutubePlayer;
}

export interface YoutubeStateEvent {
  data: number;
  target: YoutubePlayer;
}

export interface YoutubePlayerConfig {
  events: {
    onReady: (event: YoutubeReadyEvent) => void;
    onStateChange: (event: YoutubeStateEvent) => void;
  };
}

export interface YoutubeApi {
  Player: new (element: Element, config: YoutubePlayerConfig) => YoutubePlayer;
  PlayerState: { ENDED: number };
}

declare global {
  interface Window {
    YT: YoutubeApi | undefined;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

const callbacks: Array<() => void> = [];
let isAlreadyMounted = false;

const mount = (): void => {
  isAlreadyMounted = true;

  for (const callback of callbacks) {
    callback();
  }
};

export function youtubeLoadScript(callback: () => void): void {
  if (isAlreadyMounted) {
    callback();

    return;
  }

  if (callbacks.length === 0) {
    if (!document.querySelector(`script[src='${SRC}']`)) {
      const script = document.createElement("script");

      script.async = true;
      script.src = SRC;
      // A failed load still runs the callback, which then builds a player against an API that is
      // not there. That is what the jQuery version did.
      script.onerror = (): void => callback();
      script.setAttribute(makeAttr("consent"), "marketing");

      document.body.append(script);
    }

    if (window.onYouTubeIframeAPIReady === undefined) {
      window.onYouTubeIframeAPIReady = (): void => {
        if (window.Brz) {
          window.Brz.emit("plugin.video.iframe.ready");
        }
      };
    }

    if (window.Brz === undefined) {
      window.onYouTubeIframeAPIReady = mount;
    }

    if (window.Brz) {
      window.Brz.on("plugin.video.iframe.ready", mount);
    }
  }

  callbacks.push(callback);
}
