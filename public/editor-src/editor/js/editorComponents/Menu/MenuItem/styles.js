import classnames from "classnames";
import { renderStyles } from "visual/utils/cssStyle";

const hasSubMenu = ({ items = [] }) =>
  items.some((el) => el.type === "MenuItem");

const hasDropDown = (v) => (v.megaMenu === "on" ? false : hasSubMenu(v));

const getMMenuClassNames = (node) => {
  if (!node) {
    return "";
  }

  // when MMenu initialized he added the plugin classNames
  // we need to put back the plugin classNames
  let classNames = [];
  const currentClassList = node.classList;

  currentClassList.forEach((className) => {
    if (/brz-mm-(?!menu__item).*$/.test(className)) {
      classNames.push(className);
    }
  });

  return classNames;
};

export function styleClassName(v, state) {
  const { className, liClasses, megaMenu, current } = v;

  return classnames("brz-menu__item", className, liClasses, {
    "brz-menu__item--current": current && IS_EDITOR,
    "brz-menu__item-mega-menu": megaMenu === "on",
    "brz-menu__item-dropdown": hasDropDown(v),
    "brz-menu__item--opened": state.isOpen
  });
}

export function styleMmMenuClassName(v, menuItem) {
  const { className, liClasses, megaMenu, current } = v;
  const needMegaMenu = megaMenu === "on";
  const needDropDown = hasDropDown(v);
  const currentNodeClassName = getMMenuClassNames(menuItem);

  return classnames(
    "brz-menu__item",
    className,
    currentNodeClassName,
    liClasses,
    {
      "brz-mm-menu__item-empty": !needMegaMenu && !needDropDown,
      "brz-menu__item--current": current && IS_EDITOR,
      "brz-mm-menu__item-mega-menu": needMegaMenu,
      "brz-mm-menu__item-dropdown": needDropDown
    }
  );
}

export function styleMegaMenu(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleElementMegaMenuWidth"],
      interval: ["cssStyleElementMegaMenuOffsetTop"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
