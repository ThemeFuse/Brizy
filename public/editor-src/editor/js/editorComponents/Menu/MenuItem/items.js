import React from "react";
import { isView } from "visual/providers/RenderProvider";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import HotKeys from "visual/component/HotKeys";
import MenuDropDown from "visual/component/MenuDropDown";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import contextMenuExtendConfigFn from "./contextMenuExtend";

const SubMenuForView = (props) => {
  const { items } = props;
  return <>{items}</>;
};

const SubMenuForEdit = (props) => {
  const { mMenu, items, renderContext } = props;

  return mMenu ? (
    <ul className="brz-menu__sub-menu">{items}</ul>
  ) : (
    <MenuDropDown className="brz-menu__sub-menu" renderContext={renderContext}>
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
    let { level, toolbarExtend, mMenu, meta, getParent, mods, menuSelected } =
      this.props;

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
    const { megaMenu, mMenu } = this.props;
    const items = _items.filter((el) => el);

    if (items.length === 0) {
      return null;
    }

    if (megaMenu) {
      return items;
    }

    return isView(this.props.renderContext) ? (
      <SubMenuForView mMenu={mMenu} items={items} />
    ) : (
      <SubMenuForEdit
        mMenu={mMenu}
        items={items}
        renderContext={this.props.renderContext}
      />
    );
  }
}

export default MenuItemItems;
