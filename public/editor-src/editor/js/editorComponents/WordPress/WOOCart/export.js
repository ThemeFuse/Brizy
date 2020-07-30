import $ from "jquery";

export default function() {
  if ($(".brz-woocartblock").length > 0) {
    $(".brz-woocartblock").click(function(e) {
      if (!e.target.classList.contains("brz-woocart__sidebar-close")) {
        $(this)
          .find(".brz-woocart__sidebar")
          .addClass("brz-woocart__sidebar-active");
        $(this)
          .siblings(".brz-woocart-background")
          .addClass("brz-woocart-background-active");
        $("body").css("overflow", "hidden");
      }
    });

    $(".brz-woocart__sidebar-close").click(function() {
      $(this)
        .parent()
        .removeClass("brz-woocart__sidebar-active");
      $(this)
        .parents(".brz-woocartblock")
        .siblings(".brz-woocart-background")
        .removeClass("brz-woocart-background-active");
      $("body").css("overflow", "");
    });

    $(".brz-woocart-background").click(function(e) {
      if (e.target.classList.contains("brz-woocart-background")) {
        $(this).removeClass("brz-woocart-background-active");
        $(this)
          .siblings(".brz-woocartblock")
          .find(".brz-woocart__sidebar")
          .removeClass("brz-woocart__sidebar-active");
        $("body").css("overflow", "");
      }
    });
  }
}
