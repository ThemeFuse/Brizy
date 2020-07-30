import $ from "jquery";

export default function($node) {
  $node.find(".brz-switcher").each(function() {
    const $this = $(this);
    const $switcherNav = $this.find(".brz-switcher__nav");
    const $switcherNavItems = $this.find(".brz-switcher__nav--item");
    const $switcherContent = $this.find(".brz-switcher__content--tab");

    $switcherNavItems.on("click", function() {
      $switcherNav.toggleClass("brz-switcher__nav--active");
      $switcherNavItems.toggleClass("brz-switcher__nav--item--active");
      $switcherContent.toggleClass("brz-switcher__content--tab--active");

      // Emit Switcher Changed
      window.Brizy.emit("elements.switcher.changed", $this.get(0));
    });

    // style 2
    const $switcherNavControl = $this.find(".brz-switcher__nav2--control");

    $switcherNavControl.on("click", function() {
      $switcherNavControl.toggleClass("brz-switcher__nav2--control--active");
      $switcherContent.toggleClass("brz-switcher__content--tab--active");

      // Emit Switcher Changed
      window.Brizy.emit("elements.switcher.changed", $this.get(0));
    });
  });
}
