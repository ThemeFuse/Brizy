import $ from "jquery";
import {
  videoData as getVideoData,
  videoUrl as getVideoUrl
} from "visual/utils/video";

const FullScreenObserver = function() {
  var $elem = null;
  var fullscreen = false;

  var fullScreenChange = function() {
    if (fullscreen) {
      closeFullscreen();
      $elem.removeClass("brz-video-custom-fullScreen-window-show");
      fullscreen = false;

      document.removeEventListener("fullscreenchange", fullScreenChange);
      document.removeEventListener("mozfullscreenchange", fullScreenChange);
      document.removeEventListener("webkitfullscreenchange", fullScreenChange);
    }
  }.bind(this);

  return {
    change($el) {
      $elem = $el;

      if (fullscreen) {
        fullScreenChange();

        fullscreen = false;
      } else {
        openFullscreen($elem.get(0));

        // inside SetTimeOut because this events throws after requestFullscreen(don't know why)
        // find more elegant way later
        setTimeout(function() {
          document.addEventListener("fullscreenchange", fullScreenChange);
          document.addEventListener("mozfullscreenchange", fullScreenChange);
          document.addEventListener("webkitfullscreenchange", fullScreenChange);
          $elem.addClass("brz-video-custom-fullScreen-window-show");
        }, 200);

        fullscreen = true;
      }
    }
  };
};

function hideVideos($node) {
  $node.find(".brz-video .brz-iframe").each(function() {
    $(this).remove();
  });

  // remove node if iframe was youtube or vimeo
  $node.find(".brz-embed-code iframe").each(function() {
    const $this = $(this);
    const src = $this.attr("src");
    const { type } = getVideoData(src) || {};

    if (type === "youtube" || type === "vimeo") {
      const outerHTML = $this.get(0).outerHTML;
      $(this).replaceWith(outerHTML);
    }
  });

  $node.find(".brz-custom-video").each(function() {
    var $this = $(this);
    var $video = $this.find("video");
    $video.trigger("pause");
  });
}

function showVideos($node) {
  $node.find(".brz-vimeo-video, .brz-youtube-video").each(function() {
    var $this = $(this);
    var $coverElem = $this.find(".brz-video__cover");

    if (!$coverElem.length) {
      insertVideoIframe($this);
    }
  });
}

export default function($node) {
  // we don't use IntersectionObserver because without trackVisibility attribute
  // it doesn't tell you whether the element is covered by any other page content
  // or was modified by opacity, transform, filter...
  // we don't use trackVisibility attribute because it's quite expensive to compute

  // Need rearrange when changed some of elements [tabs, accordion, ... ]
  [
    "elements.tabs.changed",
    "elements.accordion.changed",
    "elements.switcher.changed"
  ].forEach(id => {
    window.Brizy.on(id, (node, options) => {
      var hiddenTabs = options.tabs.filter(tab => tab !== options.active);

      hideVideos($(hiddenTabs));
      showVideos($(options.active));
    });
  });

  ["elements.mmenu.panel.opened", "elements.mmenu.open"].forEach(id => {
    window.Brizy.on(id, node => {
      showVideos($(node));
    });
  });

  ["elements.mmenu.panel.closed", "elements.mmenu.close"].forEach(id => {
    window.Brizy.on(id, node => {
      hideVideos($(node));
    });
  });

  $(document).on("brz.popup.show", function(e, popup) {
    showVideos($(popup));
  });

  // stopping all videos inside a popup that is closed(video can be set through embed code)
  $(document).on("brz.popup.close", function(e, popup) {
    hideVideos($(popup));
  });

  $node.find(".brz-vimeo-video, .brz-youtube-video").each(function() {
    var $this = $(this);
    var $videoData = $this.find(".brz-video-data");
    var $coverElem = $this.find(".brz-video__cover");
    var population = $videoData.attr("data-population");

    if ($coverElem.length) {
      $coverElem.click(insertVideoIframe.bind(null, $this));
    } else if (population) {
      insertVideoIframe($this);
    }
  });

  // Function init click Play & Pause Button
  $node.find(".brz-custom-video").each(function() {
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
    .click(function() {
      var $shortcodeVideo = $(this).closest(".brz-video");
      changePlayerState($shortcodeVideo);
    });

  // Function init click Volume Button
  $node
    .find(".brz-custom-video .brz-video-custom-volume-btn")
    .click(function() {
      var $shortcodeVideo = $(this).closest(".brz-video");
      var muted = $shortcodeVideo.find("video").get(0).muted;
      changePlayerMute($shortcodeVideo, !muted);
    });

  // Function init click FullScreen Video
  const fullScreenObserver = new FullScreenObserver();
  $node
    .find(".brz-custom-video .brz-video-custom-fullscreen-btn")
    .click(function(event) {
      var $shortcodeVideo = $(event.target).closest(".brz-video");
      var $video = $shortcodeVideo.find(".brz-video-elem");
      var video = $video.find("video")[0];

      if (!video.src || !video.duration) return;

      fullScreenObserver.change($video);
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

  if (population) {
    var options = {
      autoplay: $coverElem.length ? 1 : 0,
      suggestedVideo: 0,
      controls: Number(controls === "true"),
      branding: Number(branding === "true"),
      intro: Number(intro === "true"),
      start: Number(start),
      end: Number(end)
    };

    src = getVideoPopulationUrl(population, options);
  }

  return src;
}

function insertVideoIframe($elem) {
  var $videoWrapper = $elem.find(".video-wrapper");
  var $coverElem = $elem.find(".brz-video__cover");

  var src = getVideoSrc($elem);

  // intrinsic-ignore - this class is needed for WP theme twentytwenty(themes/twentytwenty/assets/js/index.js?ver=1.1)
  // intrinsicRatioVideos - property contain function - makeFit which changes iframes width
  // and breaks our code(video, map inside megamenu isn't showing as example)
  var iframe = $("<iframe/>", {
    class: "brz-iframe intrinsic-ignore",
    allowfullscreen: true,
    allow: "autoplay",
    src: src
  });

  setTimeout(() => {
    $videoWrapper.append(iframe);
    $coverElem.remove();
  }, 0);
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
    video.addEventListener("loadedmetadata", function(event) {
      var duration = formatTime(event.target.duration);
      var currentTime = formatTime($timeStart);

      video.currentTime = $timeStart;
      $shortcodeVideo.find(".brz-video-custom-total-time").html(duration);
      $shortcodeVideo.find(".brz-video-custom-current-time").html(currentTime);
    });

    video.addEventListener("timeupdate", function(event) {
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

    video.addEventListener("ended", function() {
      changeIconVisibility($playPauseBtn, false);
    });

    video.addEventListener("play", function() {
      changeIconVisibility($playPauseBtn, true);
    });

    video.addEventListener("pause", function() {
      changeIconVisibility($playPauseBtn, false);
    });

    window.addEventListener("mousedown", function(event) {
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
