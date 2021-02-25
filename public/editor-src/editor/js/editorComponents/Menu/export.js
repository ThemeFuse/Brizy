import $ from "jquery";
import { debounce } from "underscore";
import { uuid } from "visual/utils/uuid";
import { LibsPro } from "visual/libs";

const hasRootContainer = $(document).find(".brz-root__container").length > 0;
const megaMenus = new Map();

const getCurrentDevice = () => {
  const { innerWidth } = window;
  let device = "desktop";

  if (innerWidth < 992) {
    device = "tablet";
  }
  if (innerWidth < 768) {
    device = "mobile";
  }

  return device;
};
let lastCurrentDevice = getCurrentDevice();

export default function($node) {
  const { MMenu } = LibsPro;

  if (!MMenu) {
    return;
  }

  const root = $node.get(0);
  $node.find("[data-mmenu-id]").each(function() {
    const $this = $(this);
    const mmenuId = $this.data().mmenuId;
    const mmenuPosition = $this.data().mmenuPosition;
    const mmenuTitle = $this.data().mmenuTitle;
    const $icon = $this.children(".brz-mm-menu__icon");
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
        title: mmenuTitle
      },
      hooks: {
        "openPanel:after": panel => {
          // Emit Menu panel opened
          window.Brizy.emit("elements.mmenu.panel.opened", panel);
        },
        "closePanel:after": panel => {
          // Emit Menu panel opened
          window.Brizy.emit("elements.mmenu.panel.closed", panel);
        },
        "open:start": function() {
          // Emit Menu panel opened
          window.Brizy.emit("elements.mmenu.open", this.node.pnls);
        },
        "close:start": function() {
          // Emit Menu panel opened
          window.Brizy.emit("elements.mmenu.close", this.node.pnls);
        }
      }
    };

    let menu;

    if (hasRootContainer) {
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
      menu = new MMenu(mmenuId, options, config);
    } else {
      menu = new MMenu(mmenuId, options);
    }

    const menuAPI = menu.API;

    $icon.on("click", function() {
      menuAPI.open();
    });

    window.Brizy.on("elements.anchor.scrolled", () => {
      menuAPI.close();
    });
  });

  // Added listener when close Header
  // need close Mega Menu
  if (root.querySelector(".brz-menu__item-mega-menu")) {
    window.Brizy.on("elements.headerSticky.show", ({ type }) => {
      if (type === "animated") {
        root.querySelectorAll(".brz-menu__item--opened").forEach(menu => {
          const megaMenuUid = menu.getAttribute("data-mega-menu-open-uid");
          setClose(megaMenuUid);
        });
      }
    });

    window.Brizy.on("elements.headerSticky.hide", ({ node, type }) => {
      if (type === "animated") {
        node.querySelectorAll(".brz-menu__item--opened").forEach(item => {
          const megaMenuUid = item.getAttribute("data-mega-menu-open-uid");
          setClose(megaMenuUid);
        });
      }
    });
  }

  $node.find(".brz-menu__item-mega-menu").each(function() {
    const item = this;
    const megaMenu = item.querySelector(".brz-mega-menu__portal");

    if (megaMenu) {
      const temporaryUid = uuid();
      const debounceMouseMove = debounce(mouseMove);

      item.setAttribute("data-mega-menu-open-uid", temporaryUid);
      megaMenu.setAttribute("data-mega-menu-uid", temporaryUid);
      megaMenus.set(temporaryUid, megaMenu);

      // Initialize
      init(item, root);

      window.addEventListener("resize", resize(root));
      document.addEventListener("mousemove", debounceMouseMove);
    }
  });
}

const getPopperPlacement = (item, settings, device) => {
  const { placement = {} } = settings;
  return placement[device] ?? "bottom";
};

const getPopperModifiers = (item, settings, device) => {
  const initialPlacement = getPopperPlacement(item, settings, device);
  const mode = settings.mods[device];
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

const getPopperReference = (menu, settings, device) => {
  return settings.mods[device] === "horizontal"
    ? menu.closest(".brz-menu")
    : menu.closest(".brz-menu__ul");
};

const getMegaMenuWidth = (item, settings, device) => {
  const { widths, mods } = settings;
  const width = widths[device];
  const widthInt = parseInt(width);
  const mode = mods[device];
  const menu = item.closest(".brz-menu");
  const menuRect = menu.getBoundingClientRect();

  if (mode === "horizontal" && device === "mobile") {
    return width;
  }

  const { clientWidth } = document.body;
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

const setOpen = (popper, target, megaMenuUid) => () => {
  const tooltip = megaMenus.get(megaMenuUid);

  tooltip.dataset.opened = true;
  tooltip.classList.add("brz-mega-menu__portal--opened");
  target.classList.add("brz-menu__item--opened");

  // update popper instance
  // have problems with display none | block
  popper.update();
};

const setClose = megaMenuUid => {
  const tooltip = megaMenus.get(megaMenuUid);

  tooltip.dataset.opened = false;
  tooltip.classList.remove("brz-mega-menu__portal--opened");

  const openedItem = document.querySelector(
    `[data-mega-menu-open-uid="${megaMenuUid}"]`
  );

  if (openedItem) {
    openedItem.classList.remove("brz-menu__item--opened");
  }
};

const mouseMove = ({ target }) => {
  const menuItem = target.closest(".brz-menu__item-mega-menu");
  let menuItemUid;

  if (menuItem) {
    menuItemUid = menuItem.getAttribute("data-mega-menu-open-uid");
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
    const parentMegaMenu = target.closest(".brz-mega-menu");

    if (parentMegaMenu) {
      const parentMenuUid = parentMegaMenu.getAttribute("data-mega-menu-uid");
      const menuItemByTarget = document.querySelector(
        `[data-mega-menu-open-uid="${parentMenuUid}"]`
      );

      if (menuItemByTarget) {
        const megaMenu = menuItemByTarget.closest(".brz-mega-menu");

        if (megaMenu && megaMenu.dataset.opened === "true") {
          return;
        }
      }
    }

    setClose(megaMenuUid);
  });
};

const resize = root => () => {
  const itemMegaMenus = root.querySelectorAll(".brz-menu__item-mega-menu");
  const device = getCurrentDevice();

  // Change the device Mode
  if (device !== lastCurrentDevice) {
    lastCurrentDevice = device;

    itemMegaMenus.forEach(item => {
      init(item, root);
    });
  } else {
    itemMegaMenus.forEach(item => {
      update(item, root);
    });
  }
};

const init = (item, root) => {
  const { CreatePopper } = LibsPro;

  if (!CreatePopper) {
    return;
  }

  let megaMenu = item.querySelector(".brz-mega-menu__portal");
  const device = lastCurrentDevice;

  // destroy popper if has initialized
  if (item.popper) {
    item.popper.destroy();
    item.popper = null;
  }

  // for mobile and vertical mode megaMenu will be
  // inside the menuItem
  // and without popper
  if (device === "mobile") {
    if (!megaMenu) {
      appendItemToMenu(item, root);
      megaMenu = item.querySelector(".brz-mega-menu__portal");
    }

    const dataSettings = megaMenu.dataset.settings;
    const settings = JSON.parse(decodeURIComponent(dataSettings));

    if (settings.mods[device] === "vertical") {
      return;
    }
  }

  // for desktop and tablet megaMenu appended to root
  if (device === "tablet" || device === "desktop") {
    if (megaMenu) {
      appendItemToRoot(item, root);
    } else {
      // find megaMenu in the root
      const megaMenuUid = item.getAttribute("data-mega-menu-open-uid");
      megaMenu = root.querySelector(`[data-mega-menu-uid="${megaMenuUid}"]`);
    }
  }

  const dataSettings = megaMenu.dataset.settings;
  const settings = JSON.parse(decodeURIComponent(dataSettings));
  const popperSettings = {
    placement: getPopperPlacement(item, settings, device),
    modifiers: getPopperModifiers(item, settings, device)
  };

  megaMenu.style.width = "100%";
  megaMenu.style.maxWidth = getMegaMenuWidth(item, settings, device);

  const reference = getPopperReference(item, settings, device);
  const popper = CreatePopper(reference, megaMenu, popperSettings);
  const temporaryUid = item.getAttribute("data-mega-menu-open-uid");

  item.popper = popper;
  item.addEventListener("mouseenter", setOpen(popper, item, temporaryUid));
};

const update = (item, root) => {
  const device = lastCurrentDevice;
  let megaMenu = item.querySelector(".brz-mega-menu__portal");

  // nothing to do for mobile with inside megaMenu
  if (device === "mobile" && megaMenu) {
    return;
  }

  // find megaMenu in the root
  const megaMenuUid = item.getAttribute("data-mega-menu-open-uid");
  megaMenu = root.querySelector(`[data-mega-menu-uid="${megaMenuUid}"]`);
  const dataSettings = megaMenu.dataset.settings;
  const settings = JSON.parse(decodeURIComponent(dataSettings));

  // update maxWidth & recalculate popper
  megaMenu.style.maxWidth = getMegaMenuWidth(item, settings, device);
  item.popper?.update();
};

const appendItemToMenu = (item, root) => {
  const megaMenuUid = item.getAttribute("data-mega-menu-open-uid");
  const megaMenu = root.querySelector(`[data-mega-menu-uid="${megaMenuUid}"]`);
  item.appendChild(megaMenu);
};

const appendItemToRoot = (item, root) => {
  const megaMenuInItem = item.querySelector(".brz-mega-menu__portal");
  root.appendChild(megaMenuInItem);
};
