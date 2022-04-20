import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Sortable from "visual/component/Sortable";
import HotKeys from "visual/component/HotKeys";
import SortableEmpty from "visual/component/Sortable/SortableEmpty";
import { hideToolbar } from "visual/component/Toolbar";
import { t } from "visual/utils/i18n";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import contextMenuExtendConfigFn from "./contextMenuExtend";

class SectionMegaMenuItems extends EditorArrayComponent {
  static get componentId() {
    return "SectionMegaMenu.Items";
  }

  static defaultProps = {
    className: "",
    meta: {}
  };

  getItemProps(itemData, itemIndex) {
    const cloneRemoveConfig = {
      getItems: () => [
        {
          id: "duplicate",
          type: "button",
          devices: "desktop",
          icon: "nc-duplicate",
          title: t("Duplicate"),
          position: 200,
          onChange: () => {
            this.cloneItem(itemIndex);
          }
        },
        {
          id: "remove",
          type: "button",
          devices: "desktop",
          icon: "nc-trash",
          title: t("Delete"),
          position: 250,
          onChange: () => {
            hideToolbar();
            this.removeItem(itemIndex);
          }
        }
      ]
    };

    return {
      meta: this.props.meta,
      toolbarExtend: this.makeToolbarPropsFromConfig2(cloneRemoveConfig)
    };
  }

  renderItemWrapper(item, itemKey, itemIndex) {
    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);

    const shortcutsTypes = [
      "duplicate",
      "copy",
      "paste",
      "pasteStyles",
      "delete",
      "horizontalAlign"
    ];

    return (
      <ContextMenuExtend
        key={itemKey}
        {...this.makeContextMenuProps(contextMenuExtendConfig)}
      >
        <HotKeys
          shortcutsTypes={shortcutsTypes}
          id={itemKey}
          onKeyDown={this.handleKeyDown}
        >
          {item}
        </HotKeys>
      </ContextMenuExtend>
    );
  }

  renderItemsContainer(items) {
    const { className } = this.props;

    if (IS_PREVIEW) {
      return <div className={className}>{items}</div>;
    }

    if (items.length) {
      return (
        <Sortable
          path={this.getId()}
          type="section"
          acceptElements={["row", "column", "shortcode", "addable"]}
        >
          <div className={className}>{items}</div>
        </Sortable>
      );
    } else {
      return (
        <div className={className}>
          <SortableEmpty
            path={this.getId()}
            type="section"
            acceptElements={["row", "column", "shortcode", "addable"]}
          />
        </div>
      );
    }
  }
}

export default SectionMegaMenuItems;
