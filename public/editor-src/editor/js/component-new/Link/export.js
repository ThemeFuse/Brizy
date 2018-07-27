import $ from "jquery";

$(document).on(
  "click",
  ".brz-anchor, .brz-wp-shortcode__menu .menu-item a",
  function(event) {
    var anchorHash = this.hash;
    var $target = $(document.getElementById(anchorHash.slice(1)));

    if ($target.length) {
      event.preventDefault();
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
  }
);
