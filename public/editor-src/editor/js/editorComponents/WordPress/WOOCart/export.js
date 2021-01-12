import $ from "jquery";

function openSidebar() {
  $(this)
    .closest(".brz-woocart__wrapper")
    .addClass("brz-woocart__wrapper--opened");
  $(document.body).addClass("brz-ow-hidden brz-woocart--opened");
}

function closeSidebar() {
  $(this)
    .closest(".brz-woocart__wrapper")
    .removeClass("brz-woocart__wrapper--opened");
  $(document.body).removeClass("brz-ow-hidden brz-woocart--opened");
}

export default function($node) {
  $node.find(".brz-woocart__wrapper").each(function() {
    const $this = $(this);
    const $cart = $this.find(".brz-woocart");
    const $close = $this.find(".brz-woocart__sidebar-close");
    const $backdrop = $this.find(".brz-woocart__background");

    $cart.on("click", openSidebar);
    $close.on("click", closeSidebar);
    $backdrop.on("click", closeSidebar);
  });
}
