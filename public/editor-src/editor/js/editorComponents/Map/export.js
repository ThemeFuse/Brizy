import $ from 'jquery';

$(".brz-map").each(function() {
  var $this = $(this);

  $this.on("click", function() {
    $this.children('iframe').css("pointer-events", "auto");
  });
  $this.on('mouseleave', function() {
    $this.children('iframe').css("pointer-events", "none");
  });
});
