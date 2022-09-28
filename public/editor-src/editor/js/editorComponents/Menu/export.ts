import {
  Instance as PopperInstance,
  Options as PopperOptions,
  Placement as PopperPlacement
} from "@popperjs/core";
import $ from "jquery";
import { debounce } from "underscore";
import { getProLibs } from "visual/libs";
import { DeviceMode } from "visual/types";
import { BrizyProLibs } from "visual/types/global";
import * as Str from "visual/utils/reader/string";
import { decodeFromString } from "visual/utils/string";
import { uuid } from "visual/utils/uuid";
import { getParentMegaMenuUid } from "./utils.common";

interface Settings {
  widths?: {
    [k in DeviceMode]: string;
  };
  mods?: {
    [k in DeviceMode]: "vertical" | "horizontal";
  };
  placement?: {
    [k in DeviceMode]: PopperPlacement;
  };
}

const $rootContainer = $(document).find(".brz-root__container");
const megaMenus = new Map<string, HTMLElement>();
const dropdowns = new Map<
  InstanceType<Required<BrizyProLibs>["Dropdown"]>,
  Settings
>();

const getCurrentDevice = (): DeviceMode => {
  const { innerWidth } = window;
  let device: DeviceMode = "desktop";

  if (innerWidth < 992) {
    device = "tablet";
  }
  if (innerWidth < 768) {
    device = "mobile";
  }

  return device;
};

let lastCurrentDevice = getCurrentDevice();

const getPopperPlacement = (
  settings: Settings,
  device: DeviceMode
): PopperPlacement => {
  const { placement } = settings;
  return placement?.[device] ?? "bottom";
};

const getPopperModifiers = (
  settings: Settings,
  device: DeviceMode
): PopperOptions["modifiers"] => {
  const initialPlacement = getPopperPlacement(settings, device);
  const mode = settings.mods?.[device];
  const fallbackPlacements =
    mode === "horizontal"
      ? [initialPlacement, "top", "auto"]
      : [initialPlacement, "right-start", "auto"];

  return [
    {
      name: "flip",
      options: {
        fallbackPlacements
      }
    }
  ];
};

const getPopperReference = (
  menu: HTMLElement,
  settings: Settings,
  device: DeviceMode
): HTMLElement | null => {
  return settings.mods?.[device] === "horizontal"
    ? menu.closest(".brz-menu")
    : menu.closest(".brz-menu__ul");
};

const getMegaMenuWidth = (
  item: HTMLElement,
  settings: Settings,
  device: DeviceMode
): string => {
  const { widths, mods } = settings;
  const width = widths?.[device] ?? "100";
  const widthInt = parseInt(width);
  const mode = mods?.[device];
  const menu = item.closest(".brz-menu");

  if ((mode === "horizontal" && device === "mobile") || !menu) {
    return width;
  }

  const { clientWidth } = document.body;
  const menuRect = menu.getBoundingClientRect();
  const nodeRect = item.getBoundingClientRect();
  const leftSpaces = nodeRect.left;
  const rightSpaces = clientWidth - nodeRect.right;
  let calcWidth;

  if (width.includes("vw")) {
    calcWidth = widthInt >= 100 ? clientWidth : clientWidth * (widthInt / 100);
  } else if (width.includes("%")) {
    calcWidth = menuRect.width * (widthInt / 100);
  } else {
    calcWidth = widthInt;
  }

  if (
    mode === "vertical" &&
    leftSpaces < calcWidth &&
    rightSpaces < calcWidth
  ) {
    const collision = 5; // collision megaMenu between window
    const leftSpacesCollision = leftSpaces - collision;
    const rightSpacesCollision = rightSpaces - collision;

    return `${Math.max(leftSpacesCollision, rightSpacesCollision)}px`;
  }

  return `${calcWidth}px`;
};

const setClose = (megaMenuUid: string): void => {
  const tooltip = megaMenus.get(megaMenuUid);

  if (tooltip) {
    tooltip.dataset.opened = "false";
    tooltip.classList.remove("brz-mega-menu__portal--opened");
    tooltip.style.maxHeight = "none";
    tooltip.style.display = "none";
    tooltip.style.overflow = "visible";

    const openedItem = document.querySelector(
      `[data-mega-menu-open-uid="${megaMenuUid}"]`
    );

    if (openedItem) {
      openedItem.classList.remove("brz-menu__item--opened");
    }
  }
};

const closeOpenedMegaMenu = (exceptions?: string[]): void => {
  megaMenus.forEach((megaMenu, megaMenuUid) => {
    if (
      megaMenu.dataset.opened === "true" &&
      !exceptions?.includes(megaMenuUid)
    ) {
      setClose(megaMenuUid);
    }
  });
};

const setOpen =
  (
    popper: PopperInstance,
    target: HTMLElement,
    megaMenuUid: string
  ): VoidFunction =>
  (): void => {
    const tooltip = megaMenus.get(megaMenuUid);

    if (tooltip) {
      const exceptionUids = [megaMenuUid];
      const parentMegaMenuUid = getParentMegaMenuUid(target);

      if (parentMegaMenuUid) {
        exceptionUids.push(parentMegaMenuUid);
      }

      closeOpenedMegaMenu(exceptionUids);

      tooltip.dataset.opened = "true";
      tooltip.style.display = "block";
      target.classList.add("brz-menu__item--opened");

      requestAnimationFrame(() => {
        const tooltipSettings = tooltip.dataset.settings ?? "";
        const settings = JSON.parse(decodeURIComponent(tooltipSettings));
        const maxWidth = getMegaMenuWidth(target, settings, lastCurrentDevice);

        if (lastCurrentDevice === "mobile" && maxWidth === "100vw") {
          tooltip.style.width = "100vw";
        } else {
          tooltip.style.width = "100%";
        }
        tooltip.style.maxWidth = maxWidth;

        // update popper instance
        // have problems with display none | block
        popper.update().then(() => {
          const offsetSpace = 20;
          const tooltipRect = tooltip.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          if (windowHeight < tooltipRect.top) {
            const diffHeight = tooltipRect.top - windowHeight;
            const maxHeight = tooltipRect.height - diffHeight - offsetSpace;
            tooltip.style.maxHeight = `${maxHeight}px`;
            tooltip.style.overflow = "auto";
          }
          if (windowHeight < tooltipRect.bottom) {
            const diffHeight = tooltipRect.bottom - windowHeight;
            const maxHeight = tooltipRect.height - diffHeight - offsetSpace;
            tooltip.style.maxHeight = `${maxHeight}px`;
            tooltip.style.overflow = "auto";
          }

          // show tooltip
          requestAnimationFrame(() => {
            tooltip.classList.add("brz-mega-menu__portal--opened");
          });
        });
      });
    }
  };

const mouseMove = ({ target }: Event): void => {
  if (target instanceof Element) {
    const menuItem = target.closest(".brz-menu__item-mega-menu");
    let menuItemUid: string | undefined;

    if (menuItem) {
      menuItemUid = menuItem.getAttribute("data-mega-menu-open-uid") ?? "";
    }

    megaMenus.forEach((megaMenu, megaMenuUid) => {
      const opened = megaMenu.dataset.opened === "true";
      const targetMegaMenu = target.closest(
        `[data-mega-menu-uid="${megaMenuUid}"]`
      );

      // inside on MegaMenu opened
      if (opened && targetMegaMenu) {
        return;
      }

      // target li menu with MegaMenu opened
      if (menuItem && menuItemUid === megaMenuUid) {
        return;
      }

      // Deep Mega Menu

      // 1 - hover on megaMenu-portal
      const parentMenuUid = getParentMegaMenuUid(target);

      if (parentMenuUid) {
        // 3 - get menu item that opened megaMenu-portal with same uid
        const menuItemByTarget = document.querySelector(
          `[data-mega-menu-open-uid="${parentMenuUid}"]`
        );

        if (menuItemByTarget) {
          const megaMenu = menuItemByTarget.closest<HTMLElement>(
            ".brz-mega-menu__portal"
          );

          if (
            megaMenu &&
            megaMenu.dataset.opened === "true" &&
            megaMenu.dataset.megaMenuUid === megaMenuUid
          ) {
            return;
          }
        }
      }

      setClose(megaMenuUid);
    });
  }
};

const appendItemToMenu = (item: HTMLElement, root: HTMLElement): void => {
  const megaMenuUid = item.getAttribute("data-mega-menu-open-uid");
  const megaMenu = root.querySelector(`[data-mega-menu-uid="${megaMenuUid}"]`);

  if (megaMenu) {
    item.appendChild(megaMenu);
  }
};

const appendItemToRoot = (item: HTMLElement, root: HTMLElement): void => {
  const megaMenuInItem = item.querySelector(".brz-mega-menu__portal");

  if (megaMenuInItem) {
    root.appendChild(megaMenuInItem);
  }
};

const init = (item: HTMLElement, root: HTMLElement): void => {
  const { CreatePopper } = getProLibs();

  if (!CreatePopper) {
    return;
  }

  let megaMenu = item.querySelector<HTMLElement>(".brz-mega-menu__portal");
  const device = lastCurrentDevice;

  // destroy popper if has initialized
  // @ts-expect-error: Property 'popper' does not exist on type 'HTMLElement'.
  if (item.popper) {
    // @ts-expect-error: Property 'popper' does not exist on type 'HTMLElement'.
    item.popper.destroy();
    // @ts-expect-error: Property 'popper' does not exist on type 'HTMLElement'.
    item.popper = null;
  }

  // for mobile and vertical mode megaMenu will be
  // inside the menuItem
  // and without popper
  if (device === "mobile") {
    if (!megaMenu) {
      appendItemToMenu(item, root);
      megaMenu = item.querySelector<HTMLElement>(".brz-mega-menu__portal");
    }

    if (megaMenu) {
      const dataSettings = megaMenu.dataset.settings ?? "";
      const settings = JSON.parse(decodeURIComponent(dataSettings));

      if (settings?.mods?.[device] === "vertical") {
        return;
      }
    }
  }

  // find megaMenu in the root
  if ((device === "tablet" || device === "desktop") && !megaMenu) {
    const megaMenuUid = item.getAttribute("data-mega-menu-open-uid");
    megaMenu = root.querySelector<HTMLElement>(
      `[data-mega-menu-uid="${megaMenuUid}"]`
    );
  }

  if (!megaMenu) {
    return;
  }

  const dataSettings = megaMenu.dataset.settings ?? "";
  const settings = JSON.parse(decodeURIComponent(dataSettings));

  // for desktop and tablet megaMenu appended to root
  if (device === "tablet" || device === "desktop") {
    appendItemToRoot(item, root);
  }

  const reference = getPopperReference(item, settings, device);

  if (reference) {
    const popperSettings = {
      placement: getPopperPlacement(settings, device),
      modifiers: getPopperModifiers(settings, device)
    };
    const popper: PopperInstance = CreatePopper(
      reference,
      megaMenu,
      popperSettings
    );
    const temporaryUid = item.getAttribute("data-mega-menu-open-uid") ?? "";

    // @ts-expect-error: Property 'popper' does not exist on type 'HTMLElement'.
    item.popper = popper;
    item.addEventListener("mouseenter", setOpen(popper, item, temporaryUid));
  }
};

const resize =
  (root: HTMLElement): VoidFunction =>
  (): void => {
    const itemMegaMenus = root.querySelectorAll<HTMLElement>(
      ".brz-menu__item-mega-menu"
    );
    const device = getCurrentDevice();

    // Change the device Mode
    if (device !== lastCurrentDevice) {
      lastCurrentDevice = device;

      itemMegaMenus.forEach((item) => {
        init(item, root);
      });

      for (const [dropdown, settings] of dropdowns) {
        dropdown.update({
          disabled: {
            position: device !== "desktop"
          },
          placement: getPopperPlacement(settings, lastCurrentDevice)
        });
      }
    }
  };

export default function ($node: JQuery): void {
  const { MMenu, Dropdown } = getProLibs();

  if (!MMenu) {
    return;
  }

  const root = $node.get(0);

  // normalize current menu item
  root
    .querySelectorAll<HTMLElement>("[data-menu-items-active]")
    .forEach((menu) => {
      const isMMenu = menu.closest(".brz-menu__mmenu");
      const menuItemsActive = menu.dataset.menuItemsActive || "";
      const currentClassName = isMMenu
        ? "brz-mm-menu__item--current"
        : "brz-menu__item--current";
      const activeItemsSelector = menuItemsActive
        .split(",")
        .map((id) => `[data-menu-item-id='${id}']`)
        .join(",");
      const oldCurrentMenus = menu.querySelectorAll(`.${currentClassName}`);
      const newCurrentMenus = menu.querySelectorAll(activeItemsSelector);

      oldCurrentMenus.forEach((menu) => {
        menu.classList.remove(currentClassName);
      });

      newCurrentMenus.forEach((menu) => {
        menu?.classList.add(currentClassName);
      });
    });

  let currentMenuOpened: string | undefined = undefined;
  let needToOpen: string | undefined = undefined;

  root.querySelectorAll<HTMLElement>("[data-mmenu-id]").forEach((node) => {
    const { mmenuId, mmenuPosition, mmenuTitle } = node.dataset;
    const icon = [...node.children].find((node) =>
      node.classList.contains("brz-mm-menu__icon")
    );
    const isSticky =
      Str.read(node.getAttribute("data-mmenu-stickyTitle")) === "on";

    if (!mmenuId || !icon) {
      return;
    }

    const options = {
      extensions: [
        "theme-dark",
        "pagedim-black",
        "border-full",
        "position-front",
        mmenuPosition
      ],
      slidingSubmenus: false,
      navbar: {
        title: mmenuTitle,
        titleLink: "custom",
        sticky: isSticky
      },
      hooks: {
        "openPanel:after": (panel: HTMLElement): void => {
          // Emit Menu panel opened
          window.Brz.emit("elements.mmenu.panel.opened", panel);
        },
        "closePanel:after": (panel: HTMLElement): void => {
          // Emit Menu panel opened
          window.Brz.emit("elements.mmenu.panel.closed", panel);
        },
        "open:start": function (): void {
          // Emit Menu panel opened
          // @ts-expect-error: mmenu function context
          window.Brz.emit("elements.mmenu.open", this.node.pnls);
        },
        "close:start": function (): void {
          // Emit Menu panel opened
          // @ts-expect-error: mmenu function context
          window.Brz.emit("elements.mmenu.close", this.node.pnls);
          currentMenuOpened = undefined;
        },
        "close:finish": function (): void {
          if (needToOpen) {
            const mMenuNode = root.querySelector(`${needToOpen}.brz-mm-menu`);

            // @ts-expect-error mmApi is added by MMenu
            if (mMenuNode?.mmApi) {
              // @ts-expect-error mmApi is added by MMenu
              mMenuNode.mmApi.open();
              needToOpen = undefined;
            }
          }
        }
      }
    };

    let menu;

    switch ($rootContainer.length) {
      case 1: {
        const config = {
          offCanvas: {
            menu: {
              insertSelector: ".brz-root__container"
            },
            page: {
              wrapIfNeeded: false,
              selector: ".brz-root__container"
            }
          }
        };
        // @ts-expect-error: No types for MMenu
        menu = new MMenu(mmenuId, options, config);
        break;
      }
      default: {
        // @ts-expect-error: No types for MMenu
        menu = new MMenu(mmenuId, options);
        break;
      }
    }

    const menuAPI = menu.API;

    icon.addEventListener("click", () => {
      if (currentMenuOpened) {
        const mMenuNode = root.querySelector(
          `${currentMenuOpened}.brz-mm-menu`
        );

        // @ts-expect-error mmApi is added by MMenu
        if (mMenuNode && mMenuNode.mmApi) {
          needToOpen = mmenuId;
          // @ts-expect-error mmApi is added by MMenu
          mMenuNode.mmApi.close(mmenuId);
        }
      } else {
        currentMenuOpened = mmenuId;
        menuAPI?.open();
      }
    });
    window.Brz.on("elements.anchor.startScrolled", () => {
      menuAPI?.close();
    });
  });

  // Added listener when close Header
  // need close Mega Menu
  if (root.querySelector(".brz-menu__item-mega-menu")) {
    window.Brz.on(
      "elements.headerSticky.show",
      ({ type }: { node: HTMLElement; type: string }) => {
        if (type === "animated") {
          root.querySelectorAll(".brz-menu__item--opened").forEach((menu) => {
            const megaMenuUid =
              menu.getAttribute("data-mega-menu-open-uid") ?? "";
            setClose(megaMenuUid);
          });
        }
      }
    );

    window.Brz.on(
      "elements.headerSticky.hide",
      ({ node, type }: { node: HTMLElement; type: string }) => {
        if (type === "animated") {
          node.querySelectorAll(".brz-menu__item--opened").forEach((item) => {
            const megaMenuUid =
              item.getAttribute("data-mega-menu-open-uid") ?? "";
            setClose(megaMenuUid);
          });
        }
      }
    );
  }

  root
    .querySelectorAll<HTMLElement>(".brz-menu__item-mega-menu")
    .forEach((node) => {
      const megaMenu = node.querySelector<HTMLElement>(
        ".brz-mega-menu__portal"
      );

      if (megaMenu) {
        const temporaryUid = uuid();

        node.setAttribute("data-mega-menu-open-uid", temporaryUid);
        megaMenu.setAttribute("data-mega-menu-uid", temporaryUid);
        megaMenus.set(temporaryUid, megaMenu);

        // Initialize
        init(node, root);
      }
    });

  if (Dropdown) {
    root
      .querySelectorAll<HTMLElement>(".brz-menu__item-dropdown")
      .forEach((node) => {
        const device = lastCurrentDevice;
        const content = [...node.children].find((node) =>
          node.classList.contains("brz-menu__dropdown")
        );

        if (content instanceof HTMLElement) {
          const dataSettings = content.dataset.settings ?? "";
          const settings = decodeFromString<Settings>(dataSettings);

          const dropdown = new Dropdown(node, content, {
            placement: getPopperPlacement(settings, device),
            offset: 5,
            disabled: {
              position: device !== "desktop"
            },
            onOpen: (): void => {
              const uid = getParentMegaMenuUid(node);
              closeOpenedMegaMenu(uid ? [uid] : undefined);
            }
          });

          dropdowns.set(dropdown, settings);
        }
      });
  }

  const debounceMouseMove = debounce(mouseMove, 150);

  window.addEventListener("resize", resize(root));
  document.addEventListener("mousemove", debounceMouseMove);
}
