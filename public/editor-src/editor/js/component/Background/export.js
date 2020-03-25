import $ from "jquery";
import "./lib/jquery.background-video";
import "./lib/jquery.parallax";

export default function($node) {
  var $parallax = $node.find(".brz-bg-image-parallax");

  if ($parallax.length > 0) {
    var $parallaxContainers = $parallax.closest(".brz-bg-media");

    $parallaxContainers.parallax({
      bgClass: "brz-bg-image-parallax"
    });

    $(window).on("resize", function() {
      $parallaxContainers.parallax("refresh");
    });
  }

  $node.find(".brz-bg-video").each(function() {
    var $this = $(this);
    var type = $this.attr("data-type");
    var loop = $this.attr("data-loop");
    var start = $this.attr("data-start");

    $this.backgroundVideo({
      type: type,
      loop: loop,
      start: start
    });
  });
}
