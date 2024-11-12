import $ from "jquery";
import { makeAttr } from "visual/utils/i18n/attribute";
import * as Num from "visual/utils/reader/number";
import {
  videoData as getVideoData,
  videoUrl as getVideoUrl
} from "visual/utils/video";
import { initCustomVideoActions } from "visual/utils/video/exportUtils";

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
      onReady: function (event) {
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
      onStateChange: function (event) {
        if (loop) {
          if (event.data == YT.PlayerState.PLAYING) {
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

function hideVideos($node) {
  $node.find(".brz-video .brz-iframe").each(function () {
    $(this).remove();
  });

  // remove node if iframe was youtube or vimeo
  $node.find(".brz-embed-code iframe").each(function () {
    const $this = $(this);
    const src = $this.attr("src");
    const { type } = getVideoData(src) || {};

    if (type === "youtube" || type === "vimeo") {
      const outerHTML = $this.get(0).outerHTML;
      $(this).replaceWith(outerHTML);
    }
  });

  $node.find(".brz-custom-video").each(function () {
    var $this = $(this);
    var $video = $this.find("video");
    $video.trigger("pause");
  });
}

function showVideos($node) {
  $node.find(".brz-vimeo-video, .brz-youtube-video").each(function () {
    var $this = $(this);
    var $coverElem = $this.find(".brz-video__cover");

    if (!$coverElem.length) {
      insertVideoIframe($this);
    }
  });
}

export default function ($node) {
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
    window.Brz.on(id, (node, options) => {
      var hiddenTabs = options.tabs.filter((tab) => tab !== options.active);

      hideVideos($(hiddenTabs));
      showVideos($(options.active));
    });
  });

  ["elements.mmenu.panel.opened", "elements.mmenu.open"].forEach((id) => {
    window.Brz.on(id, (node) => {
      showVideos($(node));
    });
  });

  ["elements.mmenu.panel.closed", "elements.mmenu.close"].forEach((id) => {
    window.Brz.on(id, (node) => {
      hideVideos($(node));
    });
  });

  $(document).on("brz.popup.show", function (e, popup) {
    showVideos($(popup));
  });

  // stopping all videos inside a popup that is closed(video can be set through embed code)
  $(document).on("brz.popup.close", function (e, popup) {
    hideVideos($(popup));
  });

  const parentElements = [];
  const players = [];
  const isIos = isIOS();

  const $youtubeVideos = $node.find(".brz-youtube-video");
  const $vimeoVideos = $node.find(".brz-vimeo-video");

  if ($youtubeVideos.length > 0) {
    youtubeLoadScript();

    // is some cases we already have "onYouTubeIframeAPIReady" on window, ex: #22054
    const oldOnYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      if (typeof oldOnYouTubeIframeAPIReady === "function") {
        oldOnYouTubeIframeAPIReady();
      }

      if (window.Brz) {
        window.Brz.emit("elements.video.iframe.ready");
      }
    };
  }

  window.Brz.on("elements.video.iframe.ready", () => {
    isYoutubeReady = true;

    $youtubeVideos.each(function (index) {
      const $this = $(this);
      const player = this.querySelector("iframe");
      const $videoData = $this.find(".brz-video-data");
      const $coverElem = $this.find(".brz-video__cover");
      const population = $videoData.attr("data-population");
      const loop = $videoData.attr("data-loop") === "true";
      const start = Number($videoData.attr("data-start"));
      const end = Number($videoData.attr("data-end"));
      const autoplay = $videoData.attr("data-autoplay") === "on";

      if (isIos) {
        parentElements.push($this);
      }

      if ($coverElem.length) {
        if (isIos) {
          // this className is needed to set opacity 0
          // in case if image height is smaller than iframe and iframe can be seen below
          this.classList.add("brz-video__ios");
          $coverElem.get(0).addEventListener("click", () => {
            if (players[index].playVideo) {
              this.classList.remove("brz-video__ios");
              players[index].playVideo();
              $coverElem.remove();
            }
          });
        } else {
          $coverElem.on("click", insertVideoIframe.bind(null, $this, false));
        }
      } else if (population) {
        insertVideoIframe($this);
      } else if (player) {
        loadYoutubeVideo(player, autoplay, loop, start, end, false);
      }
    });

    parentElements.forEach((item) => {
      const player = insertVideoIframe(item, isIos);
      players.push(player);
    });
  });

  $vimeoVideos.each(function () {
    const $this = $(this);
    const $videoData = $this.find(".brz-video-data");
    const $coverElem = $this.find(".brz-video__cover");
    const population = $videoData.attr("data-population");

    if ($coverElem.length) {
      $coverElem.on("click", insertVideoIframe.bind(null, $this, false));
    } else if (population) {
      insertVideoIframe($this);
    }
  });

  initCustomVideoActions($node.get(0), ".brz-custom-video", ".brz-video");

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

  // Lightbox
  $node.find(".brz-video__lightbox").each(function () {
    const type = this.getAttribute(makeAttr("popup-type")) ?? "iframe";
    const loop = this.getAttribute(makeAttr("loop")) === "on";
    const muted = this.getAttribute(makeAttr("muted")) === "on";
    const start = Num.read(this.getAttribute(makeAttr("start"))) ?? 0;
    const end = Num.read(this.getAttribute(makeAttr("end"))) ?? 0;
    const src = this.getAttribute("href");

    const { type: videoType, key: id } = getVideoData(src) ?? {};
    const isShortLink = videoType === "youtube" && src.includes("youtu.be");

    if (type === "inline") {
      $(this).magnificPopup({
        type: "inline",
        callbacks: {
          open: function () {
            const video = this.currItem.inlineElement[0];
            if (video) {
              video.currentTime = start;
              video.play();
              video.addEventListener("timeupdate", () => {
                if (video.currentTime >= end && end > start) {
                  video.pause();
                }
              });
            }
          },
          close: function () {
            const video = this.currItem.inlineElement[0];
            video.currentTime = 0;
            video.pause();
          }
        }
      });
    } else {
      $(this).magnificPopup({
        type: "iframe",
        closeOnContentClick: true,
        iframe: {
          patterns: {
            youtube: {
              index: isShortLink ? "youtu.be/" : "youtube.com/",
              src: `//www.youtube.com/embed/${id}?playlist=${id}&autoplay=1&mute=${muted}&loop=${loop}&start=${start}&end=${end}`
            },
            vimeo: {
              index: "vimeo.com/",
              src: `//player.vimeo.com/video/${id}?autoplay=1&muted=${muted}&loop=${loop}#t=${start}`
            }
          }
        }
      });
    }
  });
}

function getVideoSrc($elem) {
  var $videoData = $elem.find(".brz-video-data");
  var $coverElem = $elem.find(".brz-video__cover");
  var src = $videoData.attr("data-src");
  var population = $videoData.attr("data-population");
  var controls = $videoData.attr("data-controls");
  var branding = $videoData.attr("data-branding");
  var intro = $videoData.attr("data-intro");
  var start = $videoData.attr("data-start");
  var end = $videoData.attr("data-end");
  var loop = $videoData.attr("data-loop");

  if (population) {
    var options = {
      autoplay: $coverElem.length ? 1 : 0,
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

function insertVideoIframe($elem, isIos) {
  const $videoWrapper = $elem.find(".video-wrapper");
  const $coverElem = $elem.find(".brz-video__cover");
  const $videoData = $elem.find(".brz-video-data");
  const loop = $videoData.attr("data-loop") === "true";
  const start = Number($videoData.attr("data-start"));
  const end = Number($videoData.attr("data-end"));
  const autoplay = $videoData.attr("data-autoplay") === "on";
  const isYoutube = $elem[0].classList.contains("brz-youtube-video");

  const src = getVideoSrc($elem);

  // intrinsic-ignore - this class is needed for WP theme twentytwenty(themes/twentytwenty/assets/js/index.js?ver=1.1)
  // intrinsicRatioVideos - property contain function - makeFit which changes iframes width
  // and breaks our code(video, map inside megamenu isn't showing as example)
  const $iframe = $("<iframe/>", {
    class: "brz-iframe intrinsic-ignore",
    allowfullscreen: true,
    allow: "autoplay",
    title: "video-export",
    src
  });

  setTimeout(() => {
    if (isYoutube) {
      if (isYoutubeReady) {
        $videoWrapper.append($iframe);
        if (!isIos) {
          $coverElem.remove();
        }
      }
    } else {
      $videoWrapper.append($iframe);
      $coverElem.remove();
    }
  }, 0);

  const isCovered = $coverElem.length;

  if (isYoutube && isYoutubeReady) {
    return loadYoutubeVideo(
      $iframe.get(0),
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
