import { onBodyClick } from "visual/utils/export/delegate";
import { SwitcherAccessibility } from "../accessibility";
import { find, toggleClass } from "./utils";

export default function (node) {
  const switchers = new Map();

  node.querySelectorAll(".brz-switcher").forEach((switcher) => {
    const switcherNav = find(switcher, ":scope > .brz-switcher__nav");
    const switcherNavItems = find(
      switcher,
      ":scope > .brz-switcher__nav .brz-switcher__nav--item"
    );
    const switcherContent = find(
      switcher,
      ":scope > .brz-switcher__content--tab"
    );
    const switcherNav2 = find(switcher, ":scope > .brz-switcher__nav2");
    const switcherNav2Buttons = find(
      switcher,
      ":scope > .brz-switcher__nav2 .brz-switcher__nav2--button"
    );
    const isStyle2 = switcher.classList.contains("brz-switcher--style2");

    const getActiveIndex = () =>
      switcherContent.findIndex((node) =>
        node.classList.contains("brz-switcher__content--tab--active")
      );

    const accessibilityRoot = isStyle2 ? switcherNav2[0] : switcherNav[0];
    const accessibilityButtons = isStyle2
      ? switcherNav2Buttons
      : switcherNavItems;

    const switcherAccessibility =
      accessibilityRoot && accessibilityButtons.length && switcherContent.length
        ? new SwitcherAccessibility({
            root: accessibilityRoot,
            buttons: accessibilityButtons,
            panels: switcherContent,
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

    const emitChanged = () => {
      // Emit Switcher Changed
      window.Brz.emit("elements.switcher.changed", switcher, {
        active:
          switcher.querySelector(".brz-switcher__content--tab--active") ??
          undefined,
        tabs: [...switcherContent]
      });
    };

    const toggleNav = () => {
      toggleClass(switcherNav, "brz-switcher__nav--active");
      toggleClass(switcherNavItems, "brz-switcher__nav--item--active");
      toggleClass(switcherContent, "brz-switcher__content--tab--active");

      if (switcherAccessibility) {
        switcherAccessibility.sync();
      }

      emitChanged();
    };

    // style 2
    const switcherNavControl = find(
      switcher,
      ":scope > .brz-switcher__nav2 .brz-switcher__nav2--control"
    );

    const toggleSwitcher = () => {
      toggleClass(switcherNavControl, "brz-switcher__nav2--control--active");
      toggleClass(switcherContent, "brz-switcher__content--tab--active");
      toggleClass(switcherNav2Buttons, "brz-switcher__nav2__item--active");

      if (switcherAccessibility) {
        switcherAccessibility.sync();
      }

      emitChanged();
    };

    switchers.set(switcher, { toggleNav, toggleSwitcher });
  });

  onBodyClick([
    {
      selector: ".brz-switcher__nav--item",
      handler: (navItem) => {
        switchers.get(navItem.closest(".brz-switcher"))?.toggleNav();
      }
    },
    {
      selector: ".brz-switcher__nav2--button, .brz-switcher__nav2--control",
      handler: (item) => {
        switchers.get(item.closest(".brz-switcher"))?.toggleSwitcher();
      }
    }
  ]);
}
