import $ from "jquery";

export default function($node) {
  $node
    .find(
      ".brz-a[href^='#'], .brz-anchor, .link--anchor, .brz-wp-shortcode__menu .menu-item a"
    )
    .on("click", function(event) {
      const _this = this;
      const anchorHash = _this.hash;
      const $target = $(document.getElementById(anchorHash.slice(1)));

      if ($target.length) {
        event.preventDefault();

        $(document).trigger("brz.anchor.click", [_this]);
        $("html, body")
          .stop()
          .animate(
            {
              scrollTop: $target.offset().top
            },
            600,
            function() {
              location.hash = anchorHash;
              window.Brizy.emit("elements.anchor.scrolled", _this);
            }
          );
      }
    });
}
