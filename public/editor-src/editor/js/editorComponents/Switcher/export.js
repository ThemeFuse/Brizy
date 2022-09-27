import $ from "jquery";

export default function($node) {
  $node.find(".brz-switcher").each(function() {
    const $this = $(this);
    const $switcherNav = $this.find("> .brz-switcher__nav");
    const $switcherNavItems = $this.find(
      "> .brz-switcher__nav .brz-switcher__nav--item"
    );
    const $switcherContent = $this.find("> .brz-switcher__content--tab");

    $switcherNavItems.on("click", function() {
      $switcherNav.toggleClass("brz-switcher__nav--active");
      $switcherNavItems.toggleClass("brz-switcher__nav--item--active");
      $switcherContent.toggleClass("brz-switcher__content--tab--active");

      // Emit Switcher Changed
      window.Brz.emit("elements.switcher.changed", $this.get(0), {
        active: $this.find(".brz-switcher__content--tab--active").get(0),
        tabs: $switcherContent.get()
      });
    });

    // style 2
    const $switcherNavControl = $this.find(
      "> .brz-switcher__nav2 .brz-switcher__nav2--control"
    );
    const $switcherActiveContent = $this.find(
      "> .brz-switcher__nav2 .brz-switcher__nav2--button"
    );
    $switcherNavControl.on("click", function() {
      $switcherNavControl.toggleClass("brz-switcher__nav2--control--active");
      $switcherContent.toggleClass("brz-switcher__content--tab--active");
      $switcherActiveContent.toggleClass("brz-switcher__nav2__item--active");
      // Emit Switcher Changed
      window.Brz.emit("elements.switcher.changed", $this.get(0), {
        active: $this.find(".brz-switcher__content--tab--active").get(0),
        tabs: $switcherContent.get()
      });
    });
  });
}
