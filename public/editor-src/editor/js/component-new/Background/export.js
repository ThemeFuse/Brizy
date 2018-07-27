import $ from "jquery";

var $window = $(window);
var $parallax = $(".brz-bg-image-parallax");

$window.on("load", function() {
  if ($parallax.length > 0) {
    var $parallaxContainers = $parallax.closest(".brz-bg-media");

    $parallaxContainers.parallax({
      bgClass: "brz-bg-image-parallax"
    });

    $window.on("resize", function() {
      $parallaxContainers.parallax("refresh");
    });
  }
});

$(".brz-bg-video").each(function() {
  var $this = $(this);
  var type = $this.attr("data-type");
  var autoplay = $this.attr("data-autoplay");
  var quality = $this.attr("data-quality");
  var mute = $this.attr("data-mute");

  $this.backgroundVideo({
    mute: mute === "on",
    autoplay: autoplay === "on",
    type: type,
    quality: quality
  });
});
