import $ from "jquery";
import { TabsAccessibility } from "../accessibility";
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
    const orientation = $this.hasClass("brz-tabs--vertical")
      ? "vertical"
      : "horizontal";
    const instanceId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const $desktopNavItems = $this.children(".brz-tabs__nav").children("li");
    const $tabsContent = $this
      .children(".brz-tabs__content")
      .children(".brz-tabs__items");
    const tabsAccessibility = new TabsAccessibility({
      desktopItems: $desktopNavItems
        .toArray()
        .map((item, index) => {
          const button = item.querySelector(".brz-tabs__nav--button");
          const panel = $tabsContent.get(index);

          if (!(button instanceof HTMLElement) || !(panel instanceof HTMLElement)) {
            return null;
          }

          const buttonId = `brz-tabs-tab-${instanceId}-${index}`;
          const panelId = `brz-tabs-panel-${instanceId}-${index}`;

          button.setAttribute("id", buttonId);
          button.setAttribute("aria-controls", panelId);
          panel.setAttribute("id", panelId);
          panel.setAttribute("role", "tabpanel");
          panel.setAttribute("aria-labelledby", buttonId);

          return {
            item,
            button,
            panel
          };
        })
        .filter(Boolean),
      mobileItems: $tabsContent
        .toArray()
        .map((panel, index) => {
          const header = panel.querySelector(".brz-tabs__nav--mobile");
          const button = header?.querySelector(".brz-tabs__nav--button");
          const panelContent = panel.querySelector(".brz-tabs__item--content");

          if (
            !(header instanceof HTMLElement) ||
            !(button instanceof HTMLElement) ||
            !(panelContent instanceof HTMLElement)
          ) {
            return null;
          }

          const buttonId = `brz-tabs-mobile-tab-${instanceId}-${index}`;
          const panelId = `brz-tabs-mobile-panel-${instanceId}-${index}`;

          button.setAttribute("id", buttonId);
          button.setAttribute("aria-controls", panelId);
          panelContent.setAttribute("id", panelId);
          panelContent.setAttribute("role", "region");
          panelContent.setAttribute("aria-labelledby", buttonId);

          return {
            header,
            button,
            panel: panelContent
          };
        })
        .filter(Boolean),
      orientation
    });

    tabsAccessibility.init();

    if (events === "click") {
      $this.children(".brz-tabs__nav").on("click", function (e) {
        changeTab($this, e.target);
        tabsAccessibility.sync();
      });
    } else {
      $this.find(".brz-tabs__nav > li").on("mouseenter", function (e) {
        changeTab($this, e.target);
        tabsAccessibility.sync();
      });
      $this.children(".brz-tabs__nav").on("click", function (e) {
        changeTab($this, e.target);
        tabsAccessibility.sync();
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

      tabsAccessibility.sync();
    });
  });
}
