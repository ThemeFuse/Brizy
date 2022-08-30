import $ from "jquery";
import {
  videoData as getVideoData,
  videoUrl as getVideoUrl
} from "visual/utils/video";

let isYoutubeReady = false;

const youtubeLoadScript = () => {
  const candidate = document.querySelector(
    "script[src='https://www.youtube.com/iframe_api']"
  );

  if (!candidate) {
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.append(script);
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
        if (isIos) {
          event.target.pauseVideo();
        }
        if (autoplay) {
          event.target.mute();
        } else {
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
  const root = $node.get(0);
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

    if (window.onYouTubeIframeAPIReady === undefined) {
      window.onYouTubeIframeAPIReady = () => {
        if (window.Brz) {
          window.Brz.emit("elements.video.iframe.ready");
        }
      };
    }
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

  // Function init click Play & Pause Button
  $node.find(".brz-custom-video").each(function () {
    var $this = $(this);
    var $video = $this.find("video");
    var autoplay = $video.get(0).getAttribute("data-autoplay");
    var muted = $video.get(0).hasAttribute("muted");

    if (autoplay === "on") {
      changePlayerState($this);
    }
    if (muted) {
      changePlayerMute($this, true);
    }
  });

  $node
    .find(
      ".brz-custom-video .brz-video-custom-play-pause-btn, .brz-custom-video .brz-shortcode__placeholder, .brz-custom-video .brz-video__cover, .brz-custom-video video"
    )
    .click(function () {
      var $shortcodeVideo = $(this).closest(".brz-video");
      changePlayerState($shortcodeVideo);
    });

  // Function init click Volume Button
  $node
    .find(".brz-custom-video .brz-video-custom-volume-btn")
    .click(function () {
      var $shortcodeVideo = $(this).closest(".brz-video");
      var muted = $shortcodeVideo.find("video").get(0).muted;
      changePlayerMute($shortcodeVideo, !muted);
    });

  var fullscreenNode;

  const handleFullscreenChange = () => {
    const _fullScreenElement =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement ||
      document.mozFullscreenElement;

    if (fullscreenNode) {
      if (_fullScreenElement) {
        fullscreenNode.addClass("brz-video-custom-fullScreen-window-show");
      } else {
        fullscreenNode.removeClass("brz-video-custom-fullScreen-window-show");
      }
    }
  };

  root.ownerDocument.onfullscreenchange = handleFullscreenChange;
  root.ownerDocument.onwebkitfullscreenchange = handleFullscreenChange;
  root.ownerDocument.onmozfullscreenchange = handleFullscreenChange;

  // Function init click FullScreen Video
  $node
    .find(".brz-custom-video .brz-video-custom-fullscreen-btn")
    .click(function (event) {
      var $shortcodeVideo = $(event.target).closest(".brz-video");
      var $video = $shortcodeVideo.find(".brz-video-elem");
      var video = $video.find("video")[0];

      const _fullScreenElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullscreenElement;

      if (!video.src || !video.duration) return;

      if (_fullScreenElement) {
        closeFullscreen();
      } else {
        fullscreenNode = $video;
        openFullscreen($video.get(0));
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
      suggestedVideo: 0,
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

function formatTime(time) {
  var min = Math.floor(time / 60);
  var sec = Math.floor(time % 60);
  return min + ":" + (sec < 10 ? "0" + sec : sec);
}

function roundTo(num, places) {
  places = places || 2;
  return +(Math.round(num + "e+" + places) + "e-" + places);
}

function changeIconVisibility($iconsWrapper, firstIsActive) {
  var $firstIcon = $($iconsWrapper.children()[0]);
  var $secondIcon = $($iconsWrapper.children()[1]);

  if (firstIsActive) {
    $firstIcon.addClass("brz-hidden");
    $secondIcon.removeClass("brz-hidden");
  } else {
    $firstIcon.removeClass("brz-hidden");
    $secondIcon.addClass("brz-hidden");
  }
}

function getSliderOffset($slider, pageX) {
  var sliderWidth = $slider.width();
  var offsetLeft = pageX - $slider.offset().left;

  return (offsetLeft * 100) / sliderWidth;
}

function changePlayerState($shortcodeVideo) {
  var $slider = $shortcodeVideo.find(
    ".brz-video-custom-controls .brz-video-custom-slider"
  );
  var $coverImage = $shortcodeVideo.find(".brz-video__cover");
  var $coverPlaceholder = $shortcodeVideo.find(".brz-shortcode__placeholder");
  var $volumeSlider = $shortcodeVideo.find(".brz-video-custom-volume-controls");
  var $progress = $shortcodeVideo.find(
    ".brz-video-custom-controls .brz-video-custom-progress"
  );
  var $volumeProgress = $shortcodeVideo.find(
    ".brz-video-custom-volume-controls .brz-video-custom-progress"
  );
  var video = $shortcodeVideo.find("video")[0];
  var $timeStart = video.getAttribute("data-time-start");
  var timeEnd = Number(video.getAttribute("data-time-end")) || Infinity;
  var $playPauseBtn = $shortcodeVideo.find(".brz-video-custom-play-pause-btn");

  if (!video.src) return;

  changeIconVisibility($playPauseBtn, video.paused);
  video.paused ? video.play() : video.pause();

  $coverImage.addClass("brz-hidden");
  $coverPlaceholder.addClass("brz-hidden");
  $shortcodeVideo.find("video").removeAttr("class");

  if (!video.duration) {
    video.addEventListener("loadedmetadata", function (event) {
      var duration = formatTime(event.target.duration);
      var currentTime = formatTime($timeStart);

      video.currentTime = $timeStart;
      $shortcodeVideo.find(".brz-video-custom-total-time").html(duration);
      $shortcodeVideo.find(".brz-video-custom-current-time").html(currentTime);
    });

    video.addEventListener("timeupdate", function (event) {
      var currentTime = event.target.currentTime;
      var duration = event.target.duration;
      var progressPercent = (currentTime / duration) * 100;

      $progress.css("width", roundTo(progressPercent) + "%");
      $shortcodeVideo
        .find(".brz-video-custom-current-time")
        .html(formatTime(currentTime));

      if (currentTime >= timeEnd) {
        video.pause();
        timeEnd = Infinity;
      }
    });

    video.addEventListener("ended", function () {
      changeIconVisibility($playPauseBtn, false);
    });

    video.addEventListener("play", function () {
      changeIconVisibility($playPauseBtn, true);
    });

    video.addEventListener("pause", function () {
      changeIconVisibility($playPauseBtn, false);
    });

    window.addEventListener("mousedown", function (event) {
      var isSliderClick = $(event.target).closest($slider).length;
      var isSliderVolumeClick = $(event.target).closest($volumeSlider).length;

      var offsetPercent;
      if (isSliderClick) {
        offsetPercent = getSliderOffset($slider, event.pageX);
        video.currentTime = (offsetPercent * video.duration) / 100;
      }

      if (isSliderVolumeClick) {
        offsetPercent = getSliderOffset($volumeSlider, event.pageX);
        $volumeProgress.css("width", roundTo(offsetPercent) + "%");
        video.volume = offsetPercent / 100;
      }
    });
  }
}

function changePlayerMute($shortcodeVideo, muted) {
  var $volumeProgress = $shortcodeVideo.find(
    ".brz-video-custom-volume-controls .brz-video-custom-progress"
  );
  var video = $shortcodeVideo.find("video")[0];
  var $mutedBtn = $shortcodeVideo.find(".brz-video-custom-volume-btn");

  if (!video.src) return;

  changeIconVisibility($mutedBtn, muted);
  video.muted = muted;

  var volumeValue = !muted ? video.volume * 100 : 0;
  $volumeProgress.css("width", roundTo(volumeValue) + "%");
}

function getVideoPopulationUrl(population, options) {
  var videoData = getVideoData(population);

  return videoData ? getVideoUrl(videoData, options) : null;
}

function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
}
