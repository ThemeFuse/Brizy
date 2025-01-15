import React from "react";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import HotKeys from "visual/component/HotKeys";
import Sortable from "visual/component/Sortable";
import SortableEmpty from "visual/component/Sortable/SortableEmpty";
import { hideToolbar } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { isView } from "visual/providers/RenderProvider";
import { t } from "visual/utils/i18n";
import contextMenuExtendConfigFn from "./contextMenuExtend";

class SectionHeaderStickyItemItems extends EditorArrayComponent {
  static get componentId() {
    return "SectionHeaderStickyItemItems.Items";
  }

  static defaultProps = {
    className: "",
    meta: {}
  };

  getItemProps(itemData, itemIndex) {
    const meta = this.props.meta;
    const cloneRemoveConfig = {
      getItems: () => [
        {
          id: "duplicate",
          type: "button",
          devices: "desktop",
          config: {
            icon: "nc-duplicate",
            title: t("Duplicate"),
            reverseTheme: true
          },
          position: 200,
          onClick: () => {
            this.cloneItem(itemIndex);
          }
        },
        {
          id: "remove",
          type: "button",
          devices: "desktop",
          config: { icon: "nc-trash", title: t("Delete"), reverseTheme: true },
          position: 250,
          onClick: () => {
            hideToolbar();
            this.removeItem(itemIndex);
          }
        }
      ]
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig2(cloneRemoveConfig);

    return { meta, toolbarExtend };
  }

  renderItemWrapper(item, itemKey, itemIndex) {
    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);

    const shortcutsTypes = [
      "duplicate",
      "copy",
      "paste",
      "pasteStyles",
      "delete",
      "showSidebarStyling",
      "showSidebarAdvanced"
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
    if (isView(this.renderContext)) {
      return <div className={this.props.className}>{items}</div>;
    }

    if (items.length === 0) {
      return (
        <div className={this.props.className}>
          <SortableEmpty
            path={this.getId()}
            type="section"
            acceptElements={["row", "column", "shortcode", "addable"]}
          />
        </div>
      );
    }

    return (
      <Sortable
        path={this.getId()}
        type="section"
        acceptElements={["row", "column", "shortcode", "addable"]}
      >
        <div className={this.props.className}>{items}</div>
      </Sortable>
    );
  }
}

export default SectionHeaderStickyItemItems;
