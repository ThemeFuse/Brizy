import { once } from "es-toolkit";
import { makeUrl } from "visual/utils/api/utils";
import { makeAttr } from "visual/utils/i18n/attribute";
import { videoData as getVideoData } from "visual/utils/video";
import {
  changePlayerState,
  initCustomVideoActions
} from "visual/utils/video/exportUtils";

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
