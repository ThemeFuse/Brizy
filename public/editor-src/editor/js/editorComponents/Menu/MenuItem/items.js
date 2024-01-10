import React from "react";
import classnames from "classnames";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import MenuDropDown from "visual/component/MenuDropDown";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import HotKeys from "visual/component/HotKeys";
import contextMenuExtendConfigFn from "./contextMenuExtend";

const getPlacement = (level, mods) => ({
  [DESKTOP]:
    mods?.desktop === "horizontal" && level === 0
      ? "bottom-start"
      : "right-start",
  [TABLET]: "bottom-start",
  [MOBILE]: "bottom-start"
});

const renderSubMenu = (items, mMenu, level, mods) => {
  const mMenuClassName = classnames("brz-mm-menu__sub-menu", {
    "brz-menu__ul--has-dropdown": level === 0
  });

  return mMenu ? (
    <ul className={mMenuClassName}>{items}</ul>
  ) : (
    <MenuDropDown
      placement={IS_PREVIEW ? getPlacement(level, mods) : undefined}
      mods={IS_PREVIEW ? mods : undefined}
      className="brz-menu__sub-menu"
    >
      {items}
    </MenuDropDown>
  );
};

class MenuItemItems extends EditorArrayComponent {
  static get componentId() {
    return "MenuItem.Items";
  }

  static defaultProps = {
    megaMenu: false,
    mMenu: false,
    toolbarExtend: null,
    level: 0,
    getParent: () => {},
    meta: {},
    placement: null
  };

  getItemProps(itemData, itemIndex, items) {
    const props = super.getItemProps(itemData, itemIndex, items);
    let {
      level,
      toolbarExtend,
      mMenu,
      meta,
      getParent,
      mods,
      menuSelected
    } = this.props;

    return {
      ...props,
      menuSelected,
      mMenu,
      toolbarExtend,
      meta,
      getParent,
      mods,
      level: ++level
    };
  }

  renderItemWrapper(item, itemKey, itemIndex, itemData) {
    const isMenuItem = itemData.type === "MenuItem";
    const isMegaMenu = itemData.type === "SectionMegaMenu";
    const { megaMenu } = this.props;

    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);

    if (megaMenu && !isMenuItem) {
      return (
        <ContextMenuExtend
          key={itemKey}
          {...this.makeContextMenuProps(contextMenuExtendConfig)}
        >
          <HotKeys
            shortcutsTypes={["copy", "pasteStyles"]}
            id={itemKey}
            onKeyDown={this.handleKeyDown}
          >
            {item}
          </HotKeys>
        </ContextMenuExtend>
      );
    }

    if (!megaMenu && !isMegaMenu) {
      return item;
    }

    return null;
  }

  renderItemsContainer(_items) {
    const { level, megaMenu, mMenu, mods } = this.props;
    const items = _items.filter(el => el);

    if (items.length === 0) {
      return null;
    }

    return megaMenu ? items : renderSubMenu(items, mMenu, level, mods);
  }
}

export default MenuItemItems;
