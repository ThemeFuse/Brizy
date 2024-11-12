import { makeAttr } from "visual/utils/i18n/attribute";
import { handlePlaceholderControlsClick, handleVideo } from "./utils";
import { makeUrl } from "visual/utils/api/utils";
import { videoData as getVideoData } from "visual/utils/video";
import { ExportFunction } from "visual/types";

let initResize = false;

const fn: ExportFunction = ($node) => {
  const node = $node.get(0);
  if (!node) return;

  let needRefreshOnDesktop = false;

  node.querySelectorAll(".brz-video-playlist").forEach((playlist) => {
    playlist.addEventListener("click", (e) => {
      const { currentTarget, target } = e;
      const hasValidTarget =
        currentTarget instanceof HTMLElement &&
        (target instanceof HTMLElement || target instanceof SVGElement);

      if (!hasValidTarget) {
        return;
      }

      const playlistItem = target.closest(".brz-video-playlist-video-item");
      const cover = target.closest(".brz-video-playlist-main__cover");
      const video = currentTarget.querySelector(
        ".brz-video-playlist-main__video"
      );
      const placeholder = currentTarget.querySelector(
        ".brz-video-playlist-main__placeholder"
      );
      const clickedPlaceholder = target.closest(
        ".brz-video-playlist-main__placeholder"
      );
      const clickedControls = target.closest(
        ".brz-video-playlist-main__controls"
      );
      const customVideo = currentTarget.querySelector(
        ".brz-video-playlist-main__custom-video"
      );
      const customWrapper = currentTarget.querySelector(
        ".brz-video-playlist-main__custom"
      );
      const iframe = video?.querySelector(".brz-iframe");
      const videoNode = customVideo?.querySelector("video");
      const isMobile = window.innerWidth < 767;
      const activeClass = "brz-video-playlist-video-item--active";

      if (playlistItem) {
        const src = playlistItem.getAttribute(makeAttr("link"));

        currentTarget
          .querySelectorAll(".brz-video-playlist-main")
          .forEach((playlist) => playlist.classList.add("brz-d-none"));
        currentTarget
          .querySelector(".brz-video-playlist-main__controls")
          ?.classList.add("brz-d-none");
        customVideo?.classList.add("brz-d-none");

        // switch active class
        const currentVideoItem = target.closest(
          ".brz-video-playlist-video-item"
        );
        if (
          currentVideoItem?.parentNode &&
          !currentVideoItem?.classList.contains(activeClass)
        ) {
          currentVideoItem?.classList.add(activeClass);
          Array.from(currentVideoItem.parentNode.children).forEach(
            (sibling) => {
              if (sibling !== currentVideoItem) {
                sibling.classList.remove(activeClass);
              }
            }
          );
        }

        if (src) {
          handleVideo(node, currentTarget, playlistItem);

          const isExternalVideo = getVideoData(src);
          const currentNode = isExternalVideo ? video : customWrapper;

          if (isMobile && src) {
            currentNode?.classList.add("brz-video-playlist-modal");
          } else {
            currentNode?.classList.remove("brz-video-playlist-modal");
          }
        } else {
          placeholder?.classList.remove("brz-d-none");
          video
            ?.querySelector(".brz-video-playlist-main__controls")
            ?.classList.add("brz-d-none");
          customWrapper?.classList.add("brz-d-none");
          video?.classList.add("brz-d-none");

          iframe?.setAttribute("src", "");
          videoNode?.setAttribute("src", "");

          if (isMobile) {
            placeholder?.classList.add("brz-video-playlist-modal");
          } else {
            placeholder?.classList.remove("brz-video-playlist-modal");
          }
        }
      } else if (
        isMobile &&
        target.classList.contains("brz-video-playlist-modal")
      ) {
        video?.classList.remove("brz-video-playlist-modal");
        customWrapper?.classList.remove("brz-video-playlist-modal");
        placeholder?.classList.remove("brz-video-playlist-modal");
        iframe?.setAttribute("src", "");
        videoNode?.pause();

        video?.classList.add("brz-d-none");
        customWrapper?.classList.add("brz-d-none");

        needRefreshOnDesktop = true;
      }

      if (cover) {
        e.preventDefault();
        const attributesNode = cover.querySelector(".brz-play-button");

        if (attributesNode) {
          handleVideo(node, currentTarget, attributesNode);
          cover.classList.add("brz-d-none");
        }
      }

      if (clickedPlaceholder || clickedControls) {
        handlePlaceholderControlsClick(node, playlist, currentTarget);

        customWrapper?.classList.remove("brz-d-none");
        customVideo?.classList.remove("brz-d-none");
        placeholder?.classList.add("brz-d-none");
      }
    });
  });

  // onresize play video
  if (!initResize) {
    initResize = true;
    window.addEventListener("resize", () => {
      if (needRefreshOnDesktop && window.innerWidth >= 767) {
        const playlists = document.querySelectorAll<HTMLElement>(
          ".brz-video-playlist"
        );

        needRefreshOnDesktop = false;
        playlists.forEach((playlist) => {
          const sidebar = playlist.querySelector(".brz-video-playlist-sidebar");
          const currentPlaylistItem = sidebar?.querySelector(
            ".brz-video-playlist-video-item--active"
          );

          if (currentPlaylistItem) {
            const cover = playlist.querySelector(
              ".brz-video-playlist-main__cover"
            );
            const video = playlist.querySelector(
              ".brz-video-playlist-main__video"
            );
            const placeholder = playlist.querySelector(
              ".brz-video-playlist-main__placeholder"
            );
            const customVideo = playlist.querySelector(
              ".brz-video-playlist-main__custom-video"
            );
            const customControls = playlist.querySelector(
              ".brz-video-playlist-main__controls"
            );
            const hasCover = currentPlaylistItem.classList.contains(
              "brz-video-playlist-video-item__cover"
            );
            const src = currentPlaylistItem.getAttribute(makeAttr("link"));

            video?.classList.add("brz-d-none");
            placeholder?.classList.add("brz-d-none");
            cover?.classList.add("brz-d-none");
            customControls?.classList.add("brz-d-none");
            customVideo?.classList.add("brz-d-none");

            if (hasCover) {
              cover?.classList.remove("brz-d-none");
              video?.querySelector(".brz-iframe")?.setAttribute("src", "");
              customVideo?.querySelector("video")?.setAttribute("src", "");
            } else if (src) {
              handleVideo(node, playlist, currentPlaylistItem);
            } else {
              placeholder?.classList.remove("brz-d-none");
              video?.querySelector(".brz-iframe")?.setAttribute("src", "");
              customVideo?.querySelector("video")?.setAttribute("src", "");
            }
          }
        });
      }
    });
  }

  // stopping all videos inside a popup that is closed(video can be set through embed code)
  window.Brz.on("elements.popup.close", (popup: HTMLElement) => {
    popup
      .querySelectorAll<HTMLElement>(".brz-video-playlist")
      .forEach((playlist) => {
        const externalSrc = playlist
          .querySelector(".brz-iframe")
          ?.getAttribute("src");

        if (externalSrc) {
          const iframe = playlist.querySelector(".brz-iframe");
          iframe?.setAttribute("src", ""); // this forces the video to stop
          iframe?.setAttribute("src", makeUrl(externalSrc, { autoplay: "0" }));
        } else {
          const video = playlist.querySelector("video");
          video?.pause();
        }
      });
  });
};

export default fn;
