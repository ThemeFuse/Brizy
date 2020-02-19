import $ from "jquery";
import {
  videoData as getVideoData,
  videoUrl as getVideoUrl
} from "visual/utils/video";

export default function($node) {
  $node.find(".brz-video__cover").click(function(e) {
    e.preventDefault();
    var $this = $(this);
    var parentData = $this.closest(".brz-video").data();
    var src = parentData.population
      ? getVideoPopulationUrl(parentData)
      : $this.find("a[href]").attr("href");

    if (src) {
      var iframe = $("<iframe/>", {
        class: "brz-iframe",
        allowfullscreen: true,
        allow: "autoplay",
        src: src
      });

      $this.html(iframe);
    }
  });

  $node.find(".brz-video").each(function() {
    var $this = $(this);
    var data = $this.data();

    if (data.population) {
      var populationUrl = getVideoPopulationUrl(data);

      if (populationUrl) {
        $this.find(".brz-iframe").attr("src", populationUrl);
      } else {
        $this.find(".brz-shortcode__placeholder").removeClass("brz-hidden");
      }
    }
  });

  // stopping all videos inside a popup that is closed(video can be set through embed code)
  $(document).on("brz.popup.close", function(e, popup) {
    var $popup = $(popup);

    $popup
      .find(
        ".brz-video .brz-iframe, .brz-custom-video video, .brz-embed-code iframe"
      )
      .each(function() {
        var $this = $(this);
        var src = $this.attr("src");

        $this.attr("src", ""); // this forces the video to stop
        $this.attr("src", src);
      });
  });

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
    var $slider = $shortcodeVideo.find(".controls .slider");
    var $coverImage = $shortcodeVideo.find(".brz-video__cover");
    var $coverPlaceholder = $shortcodeVideo.find(".brz-shortcode__placeholder");
    var $volumeSlider = $shortcodeVideo.find(".volume-controls .slider");
    var $progress = $shortcodeVideo.find(".controls .progress");
    var $volumeProgress = $shortcodeVideo.find(".volume-controls .progress");
    var video = $shortcodeVideo.find("video")[0];
    var $timeStart = video.getAttribute("data-time-start");
    var timeEnd = Number(video.getAttribute("data-time-end")) || Infinity;
    var $playPauseBtn = $shortcodeVideo.find(".play-pause-btn");

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
        $shortcodeVideo.find(".total-time").html(duration);
        $shortcodeVideo.find(".current-time").html(currentTime);
      });

      video.addEventListener("timeupdate", function(event) {
        var currentTime = event.target.currentTime;
        var duration = event.target.duration;
        var progressPercent = (currentTime / duration) * 100;

        $progress.css("width", roundTo(progressPercent) + "%");
        $shortcodeVideo.find(".current-time").html(formatTime(currentTime));

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
    var $volumeProgress = $shortcodeVideo.find(".volume-controls .progress");
    var video = $shortcodeVideo.find("video")[0];
    var $mutedBtn = $shortcodeVideo.find(".volume-btn");

    if (!video.src) return;

    changeIconVisibility($mutedBtn, muted);
    video.muted = muted;

    var volumeValue = !muted ? video.volume * 100 : 0;
    $volumeProgress.css("width", roundTo(volumeValue) + "%");
  }
  function changeFullScreen($video) {
    var isOpen =
      !document.fullscreenElement &&
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement;

    if (!isOpen) {
      closeFullscreen();

      document.removeEventListener("fullscreenchange", close);
      document.removeEventListener("mozfullscreenchange", close);
      document.removeEventListener("webkitfullscreenchange", close);
      // $video.removeClass("fullScreen-window-show");
    } else {
      openFullscreen($video.get(0));

      document.addEventListener("fullscreenchange", close);
      document.addEventListener("mozfullscreenchange", close);
      document.addEventListener("webkitfullscreenchange", close);
      $video.addClass("fullScreen-window-show");
    }

    function close() {
      console.log("test");
      if (!isOpen) {
        closeFullscreen();
      }
    }
  }
  // Function init click Play & Pause Button
  $(".brz-custom-video").each(function() {
    var $this = $(this);
    var $video = $this.find("video");
    var autoplay = $this.get(0).getAttribute("data-autoplay");
    var muted = $video.get(0).hasAttribute("muted");

    if (autoplay === "on") {
      changePlayerState($this);
    }
    if (muted) {
      changePlayerMute($this, true);
    }
  });

  $(
    ".brz-video .play-pause-btn, .brz-video .brz-shortcode__placeholder, .brz-video .brz-video__cover, .brz-video video"
  ).click(function() {
    var $shortcodeVideo = $(this).closest(".brz-video");
    changePlayerState($shortcodeVideo);
  });

  // Function init click Volume Button
  $(".brz-video .volume-btn").click(function() {
    var $shortcodeVideo = $(this).closest(".brz-video");
    var muted = $shortcodeVideo.find("video").get(0).muted;
    changePlayerMute($shortcodeVideo, !muted);
  });

  // Function init click FullScreen Video
  $(".brz-video .fullscreen-btn").click(function(event) {
    var $shortcodeVideo = $(event.target).closest(".brz-video");
    var $video = $shortcodeVideo.find(".video");
    var video = $video.find("video")[0];

    if (!video.src || !video.duration) return;

    changeFullScreen($video);
  });
}

function getVideoPopulationUrl(data) {
  var population = data.population;
  var autoplay = data.autoPlay;
  var controls = data.controls;
  var videoData = getVideoData(population);

  if (videoData) {
    var src = getVideoUrl(videoData, {
      autoplay,
      controls,
      suggestedVideo: false
    });

    return src;
  }

  return null;
}

function openFullscreen(elem) {
  // var elem = document.documentElement;
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
