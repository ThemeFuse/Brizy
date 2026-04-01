import $ from "jquery";
import { SwitcherAccessibility } from "../accessibility";

export default function ($node) {
  $node.find(".brz-switcher").each(function () {
    const $this = $(this);
    const $switcherNav = $this.find("> .brz-switcher__nav");
    const $switcherNavItems = $this.find(
      "> .brz-switcher__nav .brz-switcher__nav--item"
    );
    const $switcherContent = $this.find("> .brz-switcher__content--tab");
    const $switcherNav2 = $this.find("> .brz-switcher__nav2");
    const $switcherNav2Buttons = $this.find(
      "> .brz-switcher__nav2 .brz-switcher__nav2--button"
    );
    const isStyle2 = $this.hasClass("brz-switcher--style2");

    const getActiveIndex = () =>
      $switcherContent
        .get()
        .findIndex((node) =>
          node.classList.contains("brz-switcher__content--tab--active")
        );

    const accessibilityRoot = isStyle2
      ? $switcherNav2.get(0)
      : $switcherNav.get(0);
    const accessibilityButtons = isStyle2
      ? $switcherNav2Buttons.get()
      : $switcherNavItems.get();

    const switcherAccessibility =
      accessibilityRoot && accessibilityButtons.length && $switcherContent.length
        ? new SwitcherAccessibility({
            root: accessibilityRoot,
            buttons: accessibilityButtons,
            panels: $switcherContent.get(),
            getActiveIndex,
            onChange: (index) => {
              const button = accessibilityButtons[index];
              if (button) {
                button.click();
              }
            }
          })
        : null;

    if (switcherAccessibility) {
      switcherAccessibility.init();
    }

    $switcherNavItems.on("click", function () {
      $switcherNav.toggleClass("brz-switcher__nav--active");
      $switcherNavItems.toggleClass("brz-switcher__nav--item--active");
      $switcherContent.toggleClass("brz-switcher__content--tab--active");

      if (switcherAccessibility) {
        switcherAccessibility.sync();
      }

      // Emit Switcher Changed
      window.Brz.emit("elements.switcher.changed", $this.get(0), {
        active: $this.find(".brz-switcher__content--tab--active").get(0),
        tabs: $switcherContent.get()
      });
    });

    // style 2
    function toggleSwitcher() {
      $switcherNavControl.toggleClass("brz-switcher__nav2--control--active");
      $switcherContent.toggleClass("brz-switcher__content--tab--active");
      $switcherActiveContent.toggleClass("brz-switcher__nav2__item--active");

      if (switcherAccessibility) {
        switcherAccessibility.sync();
      }

      // Emit Switcher Changed
      window.Brz.emit("elements.switcher.changed", $this.get(0), {
        active: $this.find(".brz-switcher__content--tab--active").get(0),
        tabs: $switcherContent.get()
      });
    }

    const $switcherNavControl = $this.find(
      "> .brz-switcher__nav2 .brz-switcher__nav2--control"
    );
    const $textItems = $this.find(
      "> .brz-switcher__nav2 .brz-switcher__nav2--button"
    );
    const $switcherActiveContent = $this.find(
      "> .brz-switcher__nav2 .brz-switcher__nav2--button"
    );
    $textItems.each(function () {
      $(this).on("click", toggleSwitcher);
    });
    $switcherNavControl.on("click", toggleSwitcher);
  });
}
