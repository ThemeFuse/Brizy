import $ from "jquery";

$(".brz-video__cover").click(function(e) {
  e.preventDefault();
  var $this = $(this);
  var src = $this.find("a[href]").attr("href");

  if (src) {
    var iframe = jQuery("<iframe/>", {
      class: "brz-iframe",
      src: src
    });

    $this.html(iframe);
  }
});
