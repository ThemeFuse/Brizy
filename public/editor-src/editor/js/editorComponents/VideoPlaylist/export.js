import $ from "jquery";
import {
  videoData as getVideoData,
  videoUrl as getVideoUrl
} from "visual/utils/video";

export default function() {
  $(".brz-video-playlist__cover").click(function(e) {
    e.preventDefault();
    var $this = $(this);
    var parent = $this.closest(".brz-video-playlist");
    var parentData = $this.closest(".brz-video-playlist").data();
    var $videoContainer = parent.find(".video-container");
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

      setTimeout(function() {
        $videoContainer.html(iframe);
      }, 100);
    }
  });

  $(".brz-video-playlist-item-container").click(function() {
    var $this = $(this);
    var parent = $this.closest(".brz-video-playlist");
    var parentData = $this.closest(".brz-video-playlist").data();
    var $videoContainer = parent.find(".video-container");
    var $mainBlock = parent.find(".col.main");
    var src = parentData.population
      ? getVideoPopulationUrl(parentData)
      : $this.find("div[data-link]").attr("data-link");

    $mainBlock.addClass("brz-video-playlist-modal");

    if (src) {
      var iframe = $("<iframe/>", {
        class: "brz-iframe",
        allowfullscreen: true,
        allow: "autoplay",
        src: src
      });

      $videoContainer.html(iframe);
    } else {
      var placeholder =
        "<div class='brz-video-content'><div class='brz-image-fix'><div class='brz-shortcode__placeholder'><svg class='brz-icon-svg'><svg id='nc_icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><g class='nc-icon-wrapper' fill='currentColor'><path fill='currentColor' d='M13.6 7.2l-10-7A1 1 0 0 0 2 1v14c0 .8.9 1.3 1.6.8l10-7c.5-.4.5-1.2 0-1.6z'></path></g></svg></svg></div></div></div>";

      $videoContainer.html(placeholder);
    }
  });

  $(".main").click(function() {
    var $this = $(this);
    var parentData = $this.closest(".brz-video-playlist");
    var $videoContainer = parentData.find(".video-container");
    var $mainBlock = parentData.find(".col.main");

    $videoContainer.html("");
    $mainBlock.removeClass("brz-video-playlist-modal");
  });

  $(".brz-video-playlist").each(function() {
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
      .find(".brz-video-playlist .brz-iframe, .brz-embed-code iframe")
      .each(function() {
        var $this = $(this);
        var src = $this.attr("src");

        $this.attr("src", ""); // this forces the video to stop
        $this.attr("src", src);
      });
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
