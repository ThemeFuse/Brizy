import $ from "jquery";
import {
  videoData as getVideoData,
  videoUrl as getVideoUrl
} from "visual/utils/video";

export default function() {
  $(".brz-video__cover").click(function(e) {
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
        src: src
      });

      $this.html(iframe);
    }
  });

  $(".brz-video").each(function() {
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

  // stopping all videos inside a popup that is closed
  $(document).on("brz.popup.close", function(e, popup) {
    var $popup = $(popup);

    $popup.find(".brz-video .brz-iframe").each(function() {
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
