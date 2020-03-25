import $ from "jquery";

export default function($node) {
  $node
    .find(".brz-anchor, .link--anchor, .brz-wp-shortcode__menu .menu-item a")
    .on("click", function(event) {
      var anchorHash = this.hash;
      var $target = $(document.getElementById(anchorHash.slice(1)));

      if ($target.length) {
        event.preventDefault();

        $(document).trigger("brz.anchor.click", [this]);
        $("html, body")
          .stop()
          .animate(
            {
              scrollTop: $target.offset().top
            },
            600,
            function() {
              location.hash = anchorHash;
            }
          );
      }
    });
}
