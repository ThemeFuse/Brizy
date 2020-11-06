import $ from "jquery";

export default function($node) {
  $node.find(".brz-woocart").click(function() {
    const $wrapper = $(this).closest(".brz-woocart__wrapper");

    $wrapper
      .find(".brz-woocart__sidebar")
      .addClass("brz-woocart__sidebar--active");
    $wrapper
      .find(".brz-woocart__background")
      .addClass("brz-woocart__background--active");

    $(document.body).addClass("brz-ow-hidden brz-woocart--opened");
  });

  $node.find(".brz-woocart__sidebar-close").click(function() {
    const $wrapper = $(this).closest(".brz-woocart__wrapper");

    $wrapper
      .find(".brz-woocart__sidebar")
      .removeClass("brz-woocart__sidebar--active");
    $wrapper
      .find(".brz-woocart__background")
      .removeClass("brz-woocart__background--active");

    $(document.body).removeClass("brz-ow-hidden brz-woocart--opened");
  });

  $node.find(".brz-woocart__background").click(function() {
    const $wrapper = $(this).closest(".brz-woocart__wrapper");

    $wrapper
      .find(".brz-woocart__sidebar")
      .removeClass("brz-woocart__sidebar--active");
    $wrapper
      .find(".brz-woocart__background")
      .removeClass("brz-woocart__background--active");

    $(document.body).removeClass("brz-ow-hidden brz-woocart--opened");
  });
}
