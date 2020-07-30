import $ from "jquery";
import "./lib/jquery.background-video";
import "./lib/jquery.parallax";

export default function($node) {
  const $parallax = $node.find(".brz-bg-image-parallax");

  if ($parallax.length > 0) {
    const $parallaxContainers = $parallax.closest(".brz-bg-media");

    $parallaxContainers.parallax({
      bgClass: "brz-bg-image-parallax"
    });

    $(window).on("resize", function() {
      $parallaxContainers.parallax("refresh");
    });
  }

  $node.find(".brz-bg-video").each(function() {
    const $this = $(this);
    const { type, loop, start } = $this.data();

    $this.backgroundVideo({ type, loop, start });
  });
}
