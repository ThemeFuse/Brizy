import React from "react";
import classnames from "classnames";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import MenuDropDown from "visual/component/MenuDropDown";

const renderSubMenu = (items, mMenu, level) => {
  const mMenuClassName = classnames("brz-mm-menu__sub-menu", {
    "brz-menu__ul--has-dropdown": level === 0
  });

  return mMenu ? (
    <ul className={mMenuClassName}>{items}</ul>
  ) : (
    <MenuDropDown className="brz-menu__sub-menu">{items}</MenuDropDown>
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

  getItemProps() {
    let {
      level,
      toolbarExtend,
      mMenu,
      meta,
      placement,
      getParent
    } = this.props;

    return {
      mMenu,
      toolbarExtend,
      meta,
      placement,
      getParent,
      level: ++level
    };
  }

  renderItemWrapper(item, itemKey, itemIndex, itemData) {
    const isMenuItem = itemData.type === "MenuItem";
    const isMegaMenu = itemData.type === "SectionMegaMenu";
    const { megaMenu } = this.props;

    if (megaMenu && !isMenuItem) {
      return item;
    }

    if (!megaMenu && !isMegaMenu) {
      return item;
    }

    return null;
  }

  renderItemsContainer(_items) {
    const { level, megaMenu, mMenu } = this.props;
    const items = _items.filter(el => el);

    if (items.length === 0) {
      return null;
    }

    return megaMenu ? items : renderSubMenu(items, mMenu, level);
  }
}

export default MenuItemItems;
