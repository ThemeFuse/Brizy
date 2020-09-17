import $ from "jquery";

export default function($node) {
  $node.find(".brz-story .brz-container").each(function() {
    var $this = $(this);

    $this.css("font-size", $this.width() * 0.23 + "px");

    $(window).resize(function() {
      $this.css("font-size", $this.width() * 0.23 + "px");
    });
  });
}
