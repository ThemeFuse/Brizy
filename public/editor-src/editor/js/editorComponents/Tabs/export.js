import { Num, Str } from "@brizy/readers";
import { onBodyClick } from "visual/utils/export/delegate";
import { makeAttr } from "visual/utils/i18n/attribute";
import {
  getFromStorage,
  setToStorage
} from "visual/utils/storage/localStorage";
import { TabsAccessibility } from "../accessibility";
import {
  animateScrollTop,
  children,
  getInnerHeight,
  getOffsetTop,
  getTabsContent,
  indexOf,
  siblings
} from "./utils";

const storageKey = (tabsId) => `brz-tabs-active:${tabsId}`;

function changeTab(tabs, target) {
  const tabsContent = getTabsContent(tabs);
  const navItem = target?.closest("li") ?? undefined;
  const navIndex = indexOf(navItem);
  const mobileActiveClassName = "brz-tabs__nav--mobile--active";

  if (navIndex === -1) {
    return;
  }

  const tabsId = tabs.getAttribute(makeAttr("tabs-id")) ?? undefined;
  if (Str.read(tabsId)) {
    setToStorage(storageKey(tabsId), String(navIndex));
  }

  // removeClass
  tabsContent.forEach((item) => {
    item.classList.remove("brz-tabs__items--active");
    children(item, ".brz-tabs__nav--mobile").forEach((navMobile) => {
      navMobile.classList.remove(mobileActiveClassName);
    });
  });
  siblings(navItem).forEach((sibling) => {
    if (sibling.matches("li")) {
      sibling.classList.remove("brz-tabs__nav--active");
    }
  });

  // addClass
  const activeContent = tabsContent[navIndex];

  navItem.classList.add("brz-tabs__nav--active");
  if (activeContent) {
    children(activeContent, ".brz-tabs__nav--mobile").forEach((navMobile) => {
      navMobile.classList.add(mobileActiveClassName);
    });
    activeContent.classList.add("brz-tabs__items--active");
  }

  // Emit Tabs Changed
  window.Brz.emit("elements.tabs.changed", tabs, {
    active: activeContent,
    tabs: tabsContent
  });
}

export default function (node) {
  const instances = new Map();

  node.querySelectorAll(".brz-tabs").forEach((tabs) => {
    const action = tabs.getAttribute(makeAttr("action")) ?? undefined;
    const orientation = tabs.classList.contains("brz-tabs--vertical")
      ? "vertical"
      : "horizontal";
    const instanceId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const navs = children(tabs, ".brz-tabs__nav");
    const desktopNavItems = navs.flatMap((nav) => children(nav, "li"));
    const tabsContent = getTabsContent(tabs);
    const tabsAccessibility = new TabsAccessibility({
      desktopItems: desktopNavItems
        .map((item, index) => {
          const button = item.querySelector(".brz-tabs__nav--button");
          const panel = tabsContent[index];

          if (
            !(button instanceof HTMLElement) ||
            !(panel instanceof HTMLElement)
          ) {
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
      mobileItems: tabsContent
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

    const handleNavChange = (e) => {
      changeTab(tabs, e.target);
      tabsAccessibility.sync();
    };

    if (action === "hover") {
      tabs.querySelectorAll(".brz-tabs__nav > li").forEach((navItem) => {
        navItem.addEventListener("mouseenter", handleNavChange);
      });
    }

    // For Mobile
    const onMobileNavClick = (navMobile) => {
      const activeClassName = "brz-tabs__items--active";
      const mobileActiveClassName = "brz-tabs__nav--mobile--active";
      const item = navMobile.closest(".brz-tabs__items") ?? undefined;
      const tabsContent = getTabsContent(tabs);
      const itemSiblings = item ? siblings(item) : [];

      const navIndex = indexOf(item);
      if (navIndex !== -1) {
        const tabsId = tabs.getAttribute(makeAttr("tabs-id")) ?? undefined;
        if (Str.read(tabsId)) {
          setToStorage(storageKey(tabsId), String(navIndex));
        }
      }

      itemSiblings.forEach((sibling) => {
        sibling.classList.remove(activeClassName);
        children(sibling, ".brz-tabs__nav--mobile").forEach((header) => {
          header.classList.remove(mobileActiveClassName);
        });
      });

      if (item) {
        item.classList.add(activeClassName);
        children(item, ".brz-tabs__nav--mobile").forEach((header) => {
          header.classList.add(mobileActiveClassName);
        });
      }

      setTimeout(() => {
        // normalize content if is outside of Viewport
        const offsetTop = getOffsetTop(navMobile);
        const stickyHeader = document.querySelector(
          ".brz-section__header-sticky-item"
        );
        const stickyHeaderHeight = stickyHeader
          ? getInnerHeight(stickyHeader)
          : 0;

        if (window.scrollY > offsetTop) {
          animateScrollTop(offsetTop - stickyHeaderHeight);
        }
      }, 100);

      // Emit Tabs Changed
      window.Brz.emit("elements.tabs.changed", item, {
        active: item,
        tabs: tabsContent
      });

      tabsAccessibility.sync();
    };

    instances.set(tabs, { handleNavChange, onMobileNavClick });

    // Restore the last active tab from storage
    const tabsId = tabs.getAttribute(makeAttr("tabs-id")) ?? undefined;
    if (Str.read(tabsId)) {
      const raw = getFromStorage(storageKey(tabsId));

      if (raw !== null) {
        const storedIndex = Num.read(raw);

        if (
          Number.isInteger(storedIndex) &&
          storedIndex >= 0 &&
          storedIndex < tabsContent.length
        ) {
          const currentIndex = tabsContent.findIndex((item) =>
            item.classList.contains("brz-tabs__items--active")
          );

          if (storedIndex !== currentIndex) {
            changeTab(tabs, desktopNavItems[storedIndex]);
            tabsAccessibility.sync();
          }
        }
      }
    }
  });

  onBodyClick([
    {
      selector: ".brz-tabs__nav",
      handler: (nav, event) => {
        instances.get(nav.parentElement)?.handleNavChange(event);
      }
    },
    {
      selector: ".brz-tabs__nav--mobile",
      handler: (navMobile) => {
        instances.forEach((state, tabs) => {
          if (tabs.contains(navMobile)) {
            state.onMobileNavClick(navMobile);
          }
        });
      }
    }
  ]);
}
