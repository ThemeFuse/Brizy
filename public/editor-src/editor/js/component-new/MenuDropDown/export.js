import $ from "jquery";

var $window = $(window);
var $target = $("body");

function MenuDropDown() {
  if ($window.width() > 767) {
    $(".brz-menu__dropdown").each(function() {
      var $this = $(this);
      var offset = $this.offset();
      var offsetRight = offset.left + $this.outerWidth();
      var targetWidth = $target.outerWidth();

      if (offsetRight >= targetWidth) {
        $this.removeClass("brz-menu__dropdown-left");
        $this.addClass("brz-menu__dropdown-right");
      } else {
        $this.removeClass("brz-menu__dropdown-right");
        $this.addClass("brz-menu__dropdown-left");
      }
    });
  }
}

MenuDropDown();

$window.on("resize", MenuDropDown);
