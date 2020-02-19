import $ from "jquery";

export default function($node) {
  $node.find(".brz-map").each(function() {
    var $this = $(this);

    $this.on("click", function() {
      $this.children("iframe").css("pointer-events", "auto");
    });
    $this.on("mouseleave", function() {
      $this.children("iframe").css("pointer-events", "none");
    });
  });
}
