import $ from "jquery";
import Isotope from "isotope-layout";

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

      // Need Update Isotope
      $switcherContent.find(".brz-image__gallery").each(function() {
        const iso = Isotope.data($(this)[0]);

        if (iso) {
          iso.layout();
        }
      });
    });

    // style 2
    const $switcherNavControl = $this.find(".brz-switcher__nav2--control");

    $switcherNavControl.on("click", function() {
      $switcherNavControl.toggleClass("brz-switcher__nav2--control--active");
      $switcherContent.toggleClass("brz-switcher__content--tab--active");

      // Need Update Isotope
      $switcherContent.find(".brz-image__gallery").each(function() {
        const iso = Isotope.data($(this)[0]);

        if (iso) {
          iso.layout();
        }
      });
    });
  });
}
