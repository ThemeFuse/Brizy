import $ from "jquery";

export default function($node) {
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

  $node.find(".brz-audio .brz-audio-play-pause-btn").click(function() {
    var $this = $(this);
    var $shortcodeAudio = $(this).closest(".brz-audio");
    var $slider = $shortcodeAudio.find(".brz-audio-controls .brz-audio-slider");
    var $volumeSlider = $shortcodeAudio.find(
      ".brz-audio-volume-controls .brz-audio-slider"
    );
    var $progress = $shortcodeAudio.find(
      ".brz-audio-controls .brz-audio-progress"
    );
    var $volumeProgress = $shortcodeAudio.find(
      ".brz-audio-volume-controls .brz-audio-progress"
    );
    var audio = $shortcodeAudio.find("audio")[0];

    if (!audio.src) return;

    changeIconVisibility($this, audio.paused);
    audio.paused ? audio.play() : audio.pause();

    if (!audio.duration) {
      audio.addEventListener("loadedmetadata", function(event) {
        var duration = formatTime(event.target.duration);
        $shortcodeAudio.find(".brz-audio-total-time").html(duration);
      });

      audio.addEventListener("timeupdate", function(event) {
        var currentTime = event.target.currentTime;
        var duration = event.target.duration;
        var progressPercent = (currentTime / duration) * 100;

        $progress.css("width", roundTo(progressPercent) + "%");
        $shortcodeAudio
          .find(".brz-audio-current-time")
          .html(formatTime(currentTime));
      });

      audio.addEventListener("ended", function() {
        changeIconVisibility($this, false);
      });

      window.addEventListener("mousedown", function(event) {
        var isSliderClick = $(event.target).closest($slider).length;
        var isSliderVolumeClick = $(event.target).closest($volumeSlider).length;

        var offsetPercent;
        if (isSliderClick) {
          offsetPercent = getSliderOffset($slider, event.pageX);
          audio.currentTime = (offsetPercent * audio.duration) / 100;
        }

        if (isSliderVolumeClick) {
          offsetPercent = getSliderOffset($volumeSlider, event.pageX);
          $volumeProgress.css("width", roundTo(offsetPercent) + "%");
          audio.volume = offsetPercent / 100;
        }
      });
    }
  });

  $node.find(".brz-audio .brz-audio-volume-btn").click(function() {
    var $this = $(this);
    var $shortcodeAudio = $(this).closest(".brz-audio");
    var $volumeProgress = $shortcodeAudio.find(
      ".brz-audio-volume-controls .brz-audio-progress"
    );
    var audio = $shortcodeAudio.find("audio")[0];

    if (!audio.src) return;

    changeIconVisibility($this, !audio.muted);
    audio.muted = !audio.muted;

    var volumeValue = audio.muted ? 0 : audio.volume * 100;
    $volumeProgress.css("width", roundTo(volumeValue) + "%");
  });
}
