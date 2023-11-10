import $ from "jquery";
import { makeAttr } from "visual/utils/i18n/attribute";

function changeTab($tabs, target) {
  const $tabsContent = $tabs
    .children(".brz-tabs__content")
    .children(".brz-tabs__items");
  const $navItem = $(target).closest("li");
  const navIndex = $navItem.index();
  const mobileActiveClassName = "brz-tabs__nav--mobile--active";

  if (navIndex === -1) {
    return;
  }

  // removeClass
  $tabsContent.removeClass("brz-tabs__items--active");
  $tabsContent
    .children(".brz-tabs__nav--mobile")
    .removeClass(mobileActiveClassName);
  $navItem.siblings("li").removeClass("brz-tabs__nav--active");

  // addClass
  $navItem.addClass("brz-tabs__nav--active");
  $($tabsContent[navIndex])
    .children(".brz-tabs__nav--mobile")
    .addClass(mobileActiveClassName);
  $($tabsContent[navIndex]).addClass("brz-tabs__items--active");

  // Emit Tabs Changed
  window.Brz.emit("elements.tabs.changed", $tabs.get(0), {
    active: $tabsContent[navIndex],
    tabs: $tabsContent.get()
  });
}

export default function ($node) {
  $node.find(".brz-tabs").each(function () {
    const $this = $(this);
    const action = $this.attr(makeAttr("action"));
    const events = action === "hover" ? "mouseenter" : "click";

    if (events === "click") {
      $this.children(".brz-tabs__nav").on("click", function (e) {
        changeTab($this, e.target);
      });
    } else {
      $this.find(".brz-tabs__nav > li").on("mouseenter", function (e) {
        changeTab($this, e.target);
      });
    }

    // For Mobile
    const $mobileTabsContent = $this.find(".brz-tabs__nav--mobile");

    $mobileTabsContent.on("click", function () {
      const $navMobile = $(this);
      const activeClassName = "brz-tabs__items--active";
      const mobileActiveClassName = "brz-tabs__nav--mobile--active";
      const $item = $navMobile.closest(".brz-tabs__items");
      const $tabsContent = $this
        .children(".brz-tabs__content")
        .children(".brz-tabs__items");

      $item.siblings().removeClass(activeClassName);
      $item
        .siblings()
        .children(".brz-tabs__nav--mobile")
        .removeClass(mobileActiveClassName);

      $item.addClass(activeClassName);
      $item.children(".brz-tabs__nav--mobile").addClass(mobileActiveClassName);

      setTimeout(function () {
        // normalize content if is outside of Viewport
        const offsetTop = $navMobile.offset().top;
        const stickyHeaderHeight = $(
          ".brz-section__header-sticky-item"
        ).innerHeight();

        if (window.scrollY > offsetTop) {
          $("html, body").animate(
            { scrollTop: offsetTop - (stickyHeaderHeight ?? 0) },
            200
          );
        }
      }, 100);

      // Emit Tabs Changed
      window.Brz.emit("elements.tabs.changed", $item.get(0), {
        active: $item.get(0),
        tabs: $tabsContent.get()
      });
    });
  });
}
