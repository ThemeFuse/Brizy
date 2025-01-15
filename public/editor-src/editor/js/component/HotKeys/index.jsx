import { produce } from "immer";
import React from "react";
import { getIn } from "timm";
import { rolesHOC } from "visual/component/Roles";
import { symbolsToItems } from "visual/editorComponents/Menu/utils";
import Config from "visual/global/Config";
import { renderHOC } from "visual/providers/RenderProvider/renderHOC";
import {
  copiedElementNoRefsSelector,
  pageDataNoRefsSelector
} from "visual/redux/selectors";
import {
  createFullModelPath,
  getClosestParent,
  mapModels
} from "visual/utils/models";
import HotKeysPlugin from "./HotKeysPlugin";

const keyNamesShortKeys = {
  duplicate: ["ctrl+D", "cmd+D", "right_cmd+D"],
  copy: ["ctrl+C", "cmd+C", "right_cmd+C"],
  paste: ["ctrl+V", "cmd+V", "right_cmd+V"],
  pasteStyles: [
    "ctrl+shift+V",
    "shift+ctrl+V",
    "cmd+shift+V",
    "shift+cmd+V",
    "right_cmd+shift+V",
    "shift+right_cmd+V"
  ],
  delete: ["ctrl+del", "cmd+del", "right_cmd+del"],
  horizontalAlign: [
    "ctrl+right",
    "ctrl+left",
    "cmd+right",
    "cmd+left",
    "right_cmd+right",
    "right_cmd+left"
  ],
  verticalAlign: [
    "ctrl+up",
    "ctrl+down",
    "cmd+up",
    "cmd+down",
    "right_cmd+up",
    "right_cmd+down"
  ],
  showSidebarStyling: ["ctrl+M", "cmd+M", "right_cmd+M"],
  showSidebarAdvanced: ["ctrl+K", "cmd+K", "right_cmd+K"],
  clearFormatting: ["alt+\\", "ctrl+\\", "cmd+\\", "right_cmd+\\"]
};

const getShortKeysByShortcuts = (types) => {
  return types.reduce((acc, key) => {
    if (keyNamesShortKeys[key]) {
      acc = [...acc, ...keyNamesShortKeys[key]];
    }
    return acc;
  }, []);
};

const HotKeysContext = React.createContext({});

class HotKeys extends React.Component {
  static contextType = HotKeysContext;

  contextValue = {
    getParentContextMenuItems: this.getItems
  };

  handleFilterItems(items, state) {
    // It's hack only for shortcodes. We calculate current active shortcode and return his callback
    if (items.length && items[0].id.startsWith("key-helper")) {
      // this enables toolbar's escape handler to work properly inside SectionPopup.
      // It filters out the popup's own escape handler when the toolbar is open
      const toolbarEscapeItem = items.find(
        (item) => item.id === "key-helper-toolbar-escape"
      );
      if (toolbarEscapeItem) {
        return [toolbarEscapeItem];
      }

      return items;
    }

    const activeEditorComponent = global.Brizy.activeEditorComponent;
    if (!activeEditorComponent) {
      return [];
    }

    const activeElementId = activeEditorComponent.getId();
    const data = pageDataNoRefsSelector(state);
    const copiedElement = copiedElementNoRefsSelector(state);
    const activeElementPath = createFullModelPath(data, [activeElementId]);
    const copiedPath = [...activeElementPath];

    const _data = attachMenu(data);

    // this condition for this cases:
    // wrapper -> cloneable
    if (keyNamesShortKeys.paste.includes(items[0].keyName)) {
      const { value: currentActiveContainerValue } = getClosestParent(
        activeElementPath,
        _data,
        ({ type }) => type === "Wrapper" || type === "Cloneable"
      );

      if (currentActiveContainerValue && copiedElement.value) {
        const { value: currentCopiedContainerValue } = getClosestParent(
          copiedElement.path,
          attachMenu(copiedElement.value),
          ({ type }) => type === "Wrapper" || type === "Cloneable"
        );

        if (
          currentCopiedContainerValue &&
          (currentCopiedContainerValue.type === "Cloneable" ||
            currentActiveContainerValue.type === "Cloneable") &&
          currentCopiedContainerValue.value.items[0].type !==
            currentActiveContainerValue.value.items[0].type
        ) {
          const item = items.find(
            ({ id }) => id === currentActiveContainerValue.value._id
          );
          if (item) {
            return [item];
          }

          return [];
        }
      }
    }

    let newPath = [];
    for (let i = 0; i <= activeElementPath.length; i++) {
      const newValue = getIn(_data, copiedPath);

      if (newValue) {
        const item = items.find(({ id }) => id === newValue._id);
        if (item) {
          return [item];
        }
      }

      newPath.unshift(copiedPath.pop());
    }

    return [];
  }

  shouldShortCutHandle(e, { keyName }) {
    const excludeSelectors = [
      ".brz-ed-sidebar__right",
      "#brz-toolbar-portal",
      ".brz-ed-tooltip__content-portal",
      ".brz-ed-popup-integrations",
      ".brz-ed-eyeDropper"
    ];

    const deleteKeyWasPressed = keyNamesShortKeys.delete.includes(keyName);
    const pasteKeyNamePressed = keyNamesShortKeys.paste.includes(keyName);
    const copyKeyNamePressed = keyNamesShortKeys.copy.includes(keyName);
    const textShortCutWasPressed =
      deleteKeyWasPressed || pasteKeyNamePressed || copyKeyNamePressed;
    const elementIsEditable =
      e.target.closest("[contenteditable=true]") ||
      e.target.closest("input") ||
      e.target.closest("textarea");

    return (
      !e.target.closest(excludeSelectors.join(",")) &&
      !(elementIsEditable && textShortCutWasPressed)
    );
  }

  getItems = () => {
    /* eslint-disable no-unused-vars */
    let {
      children,
      shortcutsTypes = [],
      keyNames = [],
      ...restProps
    } = this.props;
    /* eslint-enabled no-unused-vars */
    const { getParentContextMenuItems } = this.context;
    let props = {
      onKeyUp: () => {},
      onKeyDown: () => {},
      keyNames: [...getShortKeysByShortcuts(shortcutsTypes), ...keyNames],
      ...restProps
    };

    if (getParentContextMenuItems) {
      props = [props, ...getParentContextMenuItems()];
    } else {
      props = [props];
    }

    return props;
  };

  render() {
    const { children, id } = this.props;
    const items = this.getItems();

    return (
      <HotKeysContext.Provider value={this.contextValue}>
        {children}
        <HotKeysPlugin
          items={items}
          id={id}
          shouldKeyDownHandle={this.shouldShortCutHandle}
          shouldKeyUpHandle={this.shouldShortCutHandle}
          filterItems={this.handleFilterItems}
        />
      </HotKeysContext.Provider>
    );
  }
}
export default rolesHOC({
  allow: ["admin"],
  component: renderHOC({
    ForEdit: HotKeys,
    ForView: ({ children }) => <>{children}</>
  }),
  fallbackComponent: ({ children }) => children || null
});

function attachMenu(value) {
  const menusConfig = Config.get("menuData");

  return mapModels((block) => {
    const { type, value } = block;

    if (type === "Menu") {
      const { menuSelected: dbMenuSelected, symbols = {} } = value;
      const menuSelected = dbMenuSelected || menusConfig[0].id;
      const menuConfig =
        menusConfig.find((menu) => menu.id === menuSelected) || {};

      return produce(block, (draft) => {
        draft.value.items = symbolsToItems(menuConfig.items || [], symbols);
      });
    }

    return block;
  }, value);
}
