import $ from "jquery";

export default function() {
  $(".brz-video__cover").click(function(e) {
    e.preventDefault();
    var $this = $(this);
    var src = $this.find("a[href]").attr("href");

    if (src) {
      var iframe = $("<iframe/>", {
        class: "brz-iframe",
        allowfullscreen: true,
        src: src
      });

      $this.html(iframe);
    }
  });
}
