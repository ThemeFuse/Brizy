import { getFreeLibs } from "visual/libs";
import { onBodyClick } from "visual/utils/export/delegate";
import { makeAttr } from "visual/utils/i18n/attribute";
import * as Num from "visual/utils/reader/number";
import {
  videoData as getVideoData,
  videoUrl as getVideoUrl
} from "visual/utils/video";
import { initCustomVideoActions } from "visual/utils/video/exportUtils";
import { VideoAccessibility } from "../accessibility";

let isYoutubeReady = false;

const getPlayer = (node) => {
  if (node.classList.contains("brz-youtube-video")) {
    const player = node.querySelector("iframe");
    return player ? { type: "youtube", player } : undefined;
  }

  if (node.classList.contains("brz-vimeo-video")) {
    const player = node.querySelector("iframe");
    return player ? { type: "vimeo", player } : undefined;
  }

  if (node.classList.contains("brz-custom-video")) {
    const player = node.querySelector("video");
    return player ? { type: "custom", player } : undefined;
  }
};

const changeVideoPlayerState = (playerObj) => {
  switch (playerObj.type) {
    case "youtube":
      playerObj?.player?.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "pauseVideo"
        }),
        "*"
      );
      break;
    case "vimeo":
      playerObj?.player?.contentWindow?.postMessage(
        JSON.stringify({
          method: "pause",
          value: "true"
        }),
        "*"
      );
      break;
    case "custom":
      if (typeof playerObj?.player?.pause === "function") {
        playerObj?.player?.pause();
      }
      break;
  }
};

const youtubeLoadScript = () => {
  const candidate = document.querySelector(
    "script[src='https://www.youtube.com/iframe_api']"
  );

  if (!candidate) {
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.setAttribute(makeAttr("consent"), "marketing");
    document.body.append(script);
  }
};

const isIOS = () => {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod"
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
};

const loadYoutubeVideo = (
  player,
  autoplay,
  loop,
  start,
  end,
  isCovered,
  isIos
) => {
  return new YT.Player(player, {
    events: {
      onReady: (event) => {
        const isMuted = event.target.isMuted();

        if (isIos) {
          event.target.pauseVideo();
        }
        if (autoplay || isMuted) {
          event.target.mute();
        }
        if (!autoplay && !isMuted) {
          event.target.unMute();
        }
        if (autoplay || (isCovered && !isIos)) {
          event.target.seekTo(start);
          event.target.playVideo();
        }
      },
      onStateChange: (event) => {
        if (loop) {
          if (event.data === YT.PlayerState.PLAYING) {
            if (end > start) {
              const duration = end - start;
              setTimeout(() => event.target.seekTo(start), duration * 1000);
            } else {
              const duration = event.target.getDuration() - start;
              setTimeout(() => event.target.seekTo(start), duration * 1000);
            }
          }
        }
      }
    }
  });
};

// the elements a jQuery set of this value held: one element, a list of them or none
const toNodes = (value) =>
  (Array.isArray(value) ? value : [value]).filter(
    (node) => node instanceof Element
  );

// jQuery `.find` on a set: descendants matched inside each node, without duplicates
const findAll = (nodes, selector) => {
  const scoped = selector
    .split(",")
    .map((part) => `:scope ${part.trim()}`)
    .join(", ");

  return [
    ...new Set(
      nodes.flatMap((node) => Array.from(node.querySelectorAll(scoped)))
    )
  ];
};

const dataAttrOf = (elem) => {
  const videoData = findAll([elem], ".brz-video-data")[0];
  return (name) => videoData?.getAttribute(name) ?? undefined;
};

// jQuery `.append` on a set: clones for every target but the last
const appendTo = (targets, node) => {
  targets.forEach((target, index) => {
    target.append(index === targets.length - 1 ? node : node.cloneNode(true));
  });
};

function hideVideos(nodes) {
  findAll(nodes, ".brz-video .brz-iframe").forEach((iframe) => {
    iframe.remove();
  });

  // remove node if iframe was youtube or vimeo
  findAll(nodes, ".brz-embed-code iframe").forEach((iframe) => {
    const src = iframe.getAttribute("src") ?? undefined;
    const { type } = getVideoData(src) || {};

    if (type === "youtube" || type === "vimeo") {
      const outerHTML = iframe.outerHTML;
      iframe.outerHTML = outerHTML;
    }
  });

  findAll(nodes, ".brz-custom-video").forEach((customVideo) => {
    findAll([customVideo], "video").forEach((video) => {
      video.pause();
    });
  });
}

function showVideos(nodes) {
  findAll(nodes, ".brz-vimeo-video, .brz-youtube-video").forEach((video) => {
    if (findAll([video], ".brz-video__cover").length === 0) {
      insertVideoIframe(video);
    }
  });
}

export default function (node) {
  const { openLightbox } = getFreeLibs();

  // we don't use IntersectionObserver because without trackVisibility attribute
  // it doesn't tell you whether the element is covered by any other page content
  // or was modified by opacity, transform, filter...
  // we don't use trackVisibility attribute because it's quite expensive to compute

  // Need rearrange when changed some of elements [tabs, accordion, ... ]
  [
    "elements.tabs.changed",
    "elements.accordion.changed",
    "elements.switcher.changed"
  ].forEach((id) => {
    window.Brz.on(id, (_node, options) => {
      var hiddenTabs = options.tabs.filter((tab) => tab !== options.active);

      hideVideos(toNodes(hiddenTabs));
      showVideos(toNodes(options.active));
    });
  });

  ["elements.mmenu.panel.opened", "elements.mmenu.open"].forEach((id) => {
    window.Brz.on(id, (node) => {
      showVideos(toNodes(node));
    });
  });

  ["elements.mmenu.panel.closed", "elements.mmenu.close"].forEach((id) => {
    window.Brz.on(id, (node) => {
      hideVideos(toNodes(node));
    });
  });

  window.Brz.on("brz.popup.show", (popup) => {
    showVideos(toNodes(popup));
  });

  // stopping all videos inside a popup that is closed(video can be set through embed code)
  window.Brz.on("brz.popup.close", (popup) => {
    hideVideos(toNodes(popup));
  });

  const parentElements = [];
  const players = [];
  const coverClicks = new Map();
  const isIos = isIOS();

  const youtubeVideos = findAll([node], ".brz-youtube-video");
  const vimeoVideos = findAll([node], ".brz-vimeo-video");

  if (youtubeVideos.length > 0) {
    youtubeLoadScript();

    // is some cases we already have "onYouTubeIframeAPIReady" on window, ex: #22054
    const oldOnYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      if (typeof oldOnYouTubeIframeAPIReady === "function") {
        oldOnYouTubeIframeAPIReady();
      } else {
        const isYoutubeVideoBg =
          findAll([node], ".brz-bg-video[data-type='youtube']").length > 0;

        if (isYoutubeVideoBg) {
          window.Brz.emit("plugin.video.iframe.ready");
        }
      }

      if (window.Brz) {
        window.Brz.emit("elements.video.iframe.ready");
      }
    };
  }

  window.Brz.on("elements.video.iframe.ready", () => {
    isYoutubeReady = true;

    youtubeVideos.forEach((video, index) => {
      const player = video.querySelector("iframe");
      const dataAttr = dataAttrOf(video);
      const coverElems = findAll([video], ".brz-video__cover");
      const hasLightbox = findAll([video], ".brz-video__lightbox").length > 0;
      const population = dataAttr("data-population");
      const loop = dataAttr("data-loop") === "true";
      const start = Number(dataAttr("data-start"));
      const end = Number(dataAttr("data-end"));
      const autoplay = dataAttr("data-autoplay") === "on";

      // On iOS with lightbox: do not insert iframe or add cover click-to-play; let tap open lightbox.
      if (isIos && hasLightbox) {
        return;
      }

      if (isIos) {
        parentElements.push(video);
      }

      if (coverElems.length) {
        if (isIos) {
          // this className is needed to set opacity 0
          // in case if image height is smaller than iframe and iframe can be seen below
          video.classList.add("brz-video__ios");
          coverElems[0].addEventListener("click", () => {
            if (players[index].playVideo) {
              video.classList.remove("brz-video__ios");
              players[index].playVideo();
              coverElems.forEach((cover) => {
                cover.remove();
              });
            }
          });
        } else {
          coverClicks.set(video, () => {
            insertVideoIframe(video, false);
          });
        }
      } else if (population) {
        insertVideoIframe(video);
      } else if (player) {
        loadYoutubeVideo(player, autoplay, loop, start, end, false);
      }
    });

    parentElements.forEach((item) => {
      const player = insertVideoIframe(item, isIos);
      players.push(player);
    });
  });

  vimeoVideos.forEach((video) => {
    const dataAttr = dataAttrOf(video);
    const coverElems = findAll([video], ".brz-video__cover");
    const population = dataAttr("data-population");
    const loop = dataAttr("data-loop") === "true";
    const start = Num.read(dataAttr("data-start")) ?? 0;

    if (coverElems.length) {
      coverClicks.set(video, () => {
        insertVideoIframe(video, false);
      });
    } else if (population) {
      insertVideoIframe(video);
    }

    // When loop is enabled with a non-zero start time, native Vimeo loop
    // restarts from 0 and ignores #t=. Handle it manually via postMessage.
    if (loop && start > 0) {
      const iframe = findAll([video], "iframe")[0];
      if (!iframe) return;

      const sendMessage = (method, value) => {
        iframe.contentWindow.postMessage(
          JSON.stringify({ method, value }),
          "*"
        );
      };

      window.addEventListener("message", (event) => {
        if (!event.origin.includes("vimeo")) return;

        let data;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }

        if (data.method === "ping") {
          sendMessage("addEventListener", "finish");
        }

        if (data.event === "ready") {
          sendMessage("addEventListener", "finish");
        }

        if (data.event === "finish") {
          sendMessage("setCurrentTime", start);
          setTimeout(() => sendMessage("play"), 260);
        }
      });

      sendMessage("ping");
    }
  });

  const rootNode = node;

  if (rootNode instanceof HTMLElement) {
    const videoAccessibility = new VideoAccessibility({ root: rootNode });
    videoAccessibility.init();
  }

  initCustomVideoActions(rootNode, ".brz-custom-video", ".brz-video");

  window.Brz.on("elements.story.slide.changed", (node) => {
    if (node) {
      const allVideosInSlide = node.querySelectorAll(".brz-video");
      if (allVideosInSlide.length > 0) {
        allVideosInSlide.forEach((item) => {
          const player = getPlayer(item);

          if (player) {
            changeVideoPlayerState(player);
          }
        });
      }
    }
  });

  // Lightbox: prefer data-brz-src (href may be "#"). Use delegation so the first click is handled.
  const onLightboxClick = function (e) {
    e.preventDefault();
    const type = this.getAttribute(makeAttr("popup-type")) ?? "iframe";
    const loop = this.getAttribute(makeAttr("loop")) === "on";
    const muted = this.getAttribute(makeAttr("muted")) === "on";
    const start = Num.read(this.getAttribute(makeAttr("start"))) ?? 0;
    const end = Num.read(this.getAttribute(makeAttr("end"))) ?? 0;
    const src = this.getAttribute(makeAttr("src")) || this.getAttribute("href");

    if (!src) return;

    const { type: videoType, key: id } = getVideoData(src) ?? {};

    if (type === "inline") {
      openLightbox({
        kind: "global",
        options: {
          type: "inline",
          src,
          closeOnContentClick: false,
          mainClass: "",
          callbacks: {
            open: ({ currentItem }) => {
              const container = currentItem.inlineElement;
              const video =
                container?.tagName === "VIDEO"
                  ? container
                  : container?.querySelector("video");
              if (video && typeof video.play === "function") {
                video.currentTime = start;
                video.play();
                video.addEventListener("timeupdate", () => {
                  if (video.currentTime >= end && end > start) {
                    video.pause();
                  }
                });
              }
            },
            close: ({ currentItem }) => {
              const container = currentItem.inlineElement;
              const video =
                container?.tagName === "VIDEO"
                  ? container
                  : container?.querySelector("video");
              if (video && typeof video.pause === "function") {
                video.currentTime = 0;
                video.pause();
              }
            }
          }
        }
      }).open();
    } else if (id) {
      const embedSrc =
        videoType === "youtube"
          ? `//www.youtube.com/embed/${id}?playlist=${id}&autoplay=1&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&start=${start}&end=${end}`
          : videoType === "vimeo"
            ? `//player.vimeo.com/video/${id}?autoplay=1&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}#t=${start}`
            : null;

      if (embedSrc) {
        openLightbox({
          kind: "global",
          options: {
            type: "iframe",
            src: embedSrc,
            closeOnContentClick: true,
            mainClass: "",
            callbacks: { open: undefined, close: undefined }
          }
        }).open();
      }
    }
  };

  onBodyClick([
    {
      selector: ".brz-video__cover",
      handler: (cover) => {
        const video = cover.closest(".brz-youtube-video, .brz-vimeo-video");

        coverClicks.get(video)?.();
      }
    },
    {
      selector: ".brz-video__lightbox",
      handler: (lightbox, e) => {
        // as jQuery delegation: primary clicks on a lightbox inside the root only
        if (e.button >= 1 || lightbox === node || !node.contains(lightbox)) {
          return;
        }

        onLightboxClick.call(lightbox, e);
      }
    }
  ]);
}

function getVideoSrc(elem) {
  const dataAttr = dataAttrOf(elem);
  const coverElems = findAll([elem], ".brz-video__cover");
  var src = dataAttr("data-src");
  var population = dataAttr("data-population");
  var controls = dataAttr("data-controls");
  var branding = dataAttr("data-branding");
  var intro = dataAttr("data-intro");
  var start = dataAttr("data-start");
  var end = dataAttr("data-end");
  var loop = dataAttr("data-loop");

  if (population) {
    const options = {
      autoplay: coverElems.length ? 1 : 0,
      controls: Number(controls === "true"),
      branding: Number(branding === "true"),
      intro: Number(intro === "true"),
      start: Number(start),
      end: Number(end),
      loop: Number(loop)
    };

    src = getVideoPopulationUrl(population, options);
  }

  return src;
}

function insertVideoIframe(elem, isIos) {
  const videoWrappers = findAll([elem], ".video-wrapper");
  const coverElems = findAll([elem], ".brz-video__cover");
  const dataAttr = dataAttrOf(elem);
  const loop = dataAttr("data-loop") === "true";
  const start = Number(dataAttr("data-start"));
  const end = Number(dataAttr("data-end"));
  const autoplay = dataAttr("data-autoplay") === "on";
  const isYoutube = elem.classList.contains("brz-youtube-video");

  const src = getVideoSrc(elem);

  // intrinsic-ignore - this class is needed for WP theme twentytwenty(themes/twentytwenty/assets/js/index.js?ver=1.1)
  // intrinsicRatioVideos - property contain function - makeFit which changes iframes width
  // and breaks our code(video, map inside megamenu isn't showing as example)
  const iframe = document.createElement("iframe");
  iframe.setAttribute("class", "brz-iframe intrinsic-ignore");
  iframe.setAttribute("allowfullscreen", "true");
  iframe.setAttribute("allow", "autoplay");
  iframe.setAttribute("title", "video-export");
  if (src !== undefined && src !== null) {
    iframe.setAttribute("src", src);
  }

  setTimeout(() => {
    if (isYoutube) {
      if (isYoutubeReady) {
        appendTo(videoWrappers, iframe);
        if (!isIos) {
          coverElems.forEach((cover) => {
            cover.remove();
          });
        }
      }
    } else {
      appendTo(videoWrappers, iframe);
      coverElems.forEach((cover) => {
        cover.remove();
      });
    }
  }, 0);

  const isCovered = coverElems.length;

  if (isYoutube && isYoutubeReady) {
    return loadYoutubeVideo(
      iframe,
      autoplay,
      loop,
      start,
      end,
      isCovered,
      isIos
    );
  }
}

function getVideoPopulationUrl(population, options) {
  var videoData = getVideoData(population);

  return videoData ? getVideoUrl(videoData, options) : null;
}
