import classnames from "classnames";

const hasSubMenu = v => {
  const { megaMenu, items } = v;

  if (megaMenu === "on") {
    return false;
  }

  return items.some(el => el.type === "MenuItem");
};

export function styleClassName(v, state) {
  const { className, megaMenu } = v;

  return classnames(
    "brz-menu__item",
    { "brz-menu__item-mega-menu": megaMenu === "on" },
    { "brz-menu__item-dropdown": hasSubMenu(v) },
    { "brz-menu__item--opened": state.isOpen },
    className
  );
}

export function styleMmMenuClassName(v) {
  const { className } = v;

  return classnames("brz-mm-menu__item", className);
}
