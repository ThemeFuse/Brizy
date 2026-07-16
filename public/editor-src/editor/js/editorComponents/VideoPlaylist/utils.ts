import { once } from "es-toolkit";
import { Num } from "@brizy/readers";
import { makeUrl } from "visual/utils/api/utils";
import { makeAttr } from "visual/utils/i18n/attribute";
import { videoData as getVideoData } from "visual/utils/video";
import {
  changePlayerState,
  initCustomVideoActions
} from "visual/utils/video/exportUtils";

// WeakMap so each playlist element holds its own AbortController for the
// active loop listener, preventing listener accumulation on video switch.
const loopControllers = new WeakMap<Element, AbortController>();

const getLoopController = (playlist: Element): AbortSignal => {
  loopControllers.get(playlist)?.abort();
  const controller = new AbortController();
  loopControllers.set(playlist, controller);
  return controller.signal;
};

export const setupVimeoLoopOnFinish = (
  iframe: HTMLIFrameElement,
  start: number,
  playlist: Element
): void => {
  const signal = getLoopController(playlist);

  const sendMessage = (method: string, value?: unknown) => {
    iframe.contentWindow?.postMessage(JSON.stringify({ method, value }), "*");
  };

  window.addEventListener(
    "message",
    (event: MessageEvent) => {
      if (!event.origin.includes("vimeo")) return;

      let data: { method?: string; event?: string };
      try {
        data = JSON.parse(event.data as string);
      } catch {
        return;
      }

      if (data.method === "ping" || data.event === "ready") {
        sendMessage("addEventListener", "finish");
      }

      if (data.event === "finish") {
        sendMessage("setCurrentTime", start);
        setTimeout(() => sendMessage("play"), 260);
      }
    },
    { signal }
  );

  sendMessage("ping");
};

export const setupYouTubeLoopOnFinish = (
  iframe: HTMLIFrameElement,
  start: number,
  playlist: Element
): void => {
  const signal = getLoopController(playlist);

  const sendCommand = (func: string, args?: unknown[]) => {
    iframe.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    );
  };

  const subscribe = () => {
    iframe.contentWindow?.postMessage(
      JSON.stringify({ event: "listening" }),
      "*"
    );
  };

  window.addEventListener(
    "message",
    (event: MessageEvent) => {
      if (!event.origin.includes("youtube")) return;

      let data: { event?: string; info?: { playerState?: number } };
      try {
        data = JSON.parse(event.data as string);
      } catch {
        return;
      }

      // Re-subscribe on each load cycle (covers src changes).
      if (data.event === "initialDelivery") {
        subscribe();
      }

      // playerState 0 = ended
      if (data.event === "infoDelivery" && data.info?.playerState === 0) {
        sendCommand("seekTo", [start, true]);
        sendCommand("playVideo");
      }
    },
    { signal }
  );

  // If the iframe is already loaded (pre-rendered case), subscribe immediately.
  // Otherwise wait for it to finish loading (src was just set in handleVideo).
  if (iframe.contentDocument?.readyState === "complete") {
    subscribe();
  } else {
    iframe.addEventListener("load", subscribe, { once: true, signal });
  }
};

let isVideoActionsCreated = false;
export const handleVideo = (
  node: Element,
  playlist: Element,
  attributesNode: Element
): void => {
  const src = attributesNode.getAttribute(makeAttr("link"));

  if (!src) return;

  const externalWrapper = playlist.querySelector(
    ".brz-video-playlist-main__video"
  );
  const customWrapper = playlist.querySelector(
    ".brz-video-playlist-main__custom"
  );
  const customVideo = playlist.querySelector(
    ".brz-video-playlist-main__custom-video"
  );

  let videoNode = playlist.querySelector("video");
  let iframe = playlist.querySelector(".brz-iframe");

  if (getVideoData(src)) {
    const videoInfo = getVideoData(src);
    const isVimeo = videoInfo?.type === "vimeo";
    const loop = attributesNode.getAttribute(makeAttr("loop"));
    const start = Num.read(attributesNode.getAttribute(makeAttr("start"))) ?? 0;

    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.classList.add("brz-iframe", "intrinsic-ignore");
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("allow", "autoplay");
      externalWrapper?.appendChild(iframe);
    }

    // hide custom video
    videoNode?.removeAttribute("src");
    customWrapper?.classList.add("brz-d-none");

    // show external video
    iframe.setAttribute(
      "src",
      makeUrl(src, {
        autoplay: "1"
      })
    );
    iframe?.classList.remove("brz-d-none");
    externalWrapper?.classList.remove("brz-d-none");

    // Native loop ignores the start time on subsequent loops for both YouTube
    // and Vimeo. When loop + start > 0, handle looping manually via postMessage.
    if (loop === "on" && start > 0) {
      const iframeEl = iframe as HTMLIFrameElement;
      if (isVimeo) {
        setupVimeoLoopOnFinish(iframeEl, start, playlist);
      } else {
        setupYouTubeLoopOnFinish(iframeEl, start, playlist);
      }
    }
  } else {
    const start = attributesNode.getAttribute(makeAttr("start"));
    const end = attributesNode.getAttribute(makeAttr("end"));
    const loop = attributesNode.getAttribute(makeAttr("loop"));
    const controls = attributesNode.getAttribute(makeAttr("controls"));

    if (!videoNode) {
      videoNode = document.createElement("video");
      videoNode.classList.add("brz-iframe", "intrinsic-ignore");
      videoNode.setAttribute("preload", "none");
      videoNode.setAttribute("playsInline", "");
      customVideo?.appendChild(videoNode);
    }

    if (!isVideoActionsCreated) {
      isVideoActionsCreated = true;
      initCustomVideoActions(node, ".brz-video-playlist");
    }

    // hide external video
    iframe?.removeAttribute("src");
    iframe?.classList.add("brz-d-none");

    // show custom video
    videoNode?.setAttribute("src", src);
    videoNode?.setAttribute("autoplay", "");

    if (start) videoNode?.setAttribute("data-time-start", start);
    if (end) videoNode?.setAttribute("data-time-end", end);

    const videoControls = playlist.querySelector(
      ".brz-video-playlist-main__controls"
    );

    if (controls === "on") {
      videoControls?.classList.remove("brz-d-none");
    } else if (controls === "off") {
      videoControls?.classList.add("brz-d-none");
    }
    if (loop === "off") {
      videoNode?.removeAttribute("loop");
    } else if (loop === "on") {
      videoNode?.setAttribute("loop", "");
    }

    changePlayerState(playlist);
    customWrapper?.classList.remove("brz-d-none");
    customVideo?.classList.remove("brz-d-none");
  }
};

export const handlePlaceholderControlsClick = once(
  (node: Element, playlist: Element, currentTarget: HTMLElement) => {
    const sidebar = playlist.querySelector(".brz-video-playlist-sidebar");
    const currentPlaylistItem = sidebar?.querySelector(
      ".brz-video-playlist-video-item--active"
    );

    if (currentPlaylistItem) {
      handleVideo(node, currentTarget, currentPlaylistItem);
    }
  }
);
