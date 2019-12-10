import $ from "jquery";
import "./lib/jquery.background-video";
import "./lib/jquery.parallax";

export default function() {
  var $parallax = $(".brz-bg-image-parallax");

  if ($parallax.length > 0) {
    var $parallaxContainers = $parallax.closest(".brz-bg-media");

    $parallaxContainers.parallax({
      bgClass: "brz-bg-image-parallax"
    });

    $(window).on("resize", function() {
      $parallaxContainers.parallax("refresh");
    });
  }

  $(".brz-bg-video").each(function() {
    var $this = $(this);
    var type = $this.attr("data-type");
    var quality = $this.attr("data-quality");
    var loop = $this.attr("data-loop");
    var start = $this.attr("data-start");

    $this.backgroundVideo({
      type: type,
      quality: quality,
      loop: loop,
      start: start
    });
  });
}
