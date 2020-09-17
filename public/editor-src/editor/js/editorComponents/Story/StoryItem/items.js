import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Sortable from "visual/component/Sortable";
import SortableEmpty from "visual/component/Sortable/SortableEmpty";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import HotKeys from "visual/component/HotKeys";
import { setOffsetsToElementFromWrapper } from "visual/utils/models";
import contextMenuExtendConfigFn from "./contextMenuExtend";
import { t } from "visual/utils/i18n";
import { hideToolbar } from "visual/component/Toolbar";

class StoryItemItems extends EditorArrayComponent {
  static get componentId() {
    return "StoryItem.Items";
  }

  static defaultProps = {
    className: "",
    meta: {}
  };

  state = {
    fontSize: ""
  };

  elementRef = React.createRef();

  componentDidMount() {
    this.setState({
      fontSize: this.elementRef?.current?.offsetWidth * 0.23 + "px"
    });
  }

  getItemProps(itemData, itemIndex) {
    const meta = this.props.meta;
    const cloneRemoveConfig = {
      getItemsForDesktop: () => [
        {
          id: "duplicate",
          type: "button",
          icon: "nc-duplicate",
          title: t("Duplicate"),
          position: 200,
          onChange: () => {
            const wrapper = this.getDBValue()[itemIndex];
            const newWrapper = setOffsetsToElementFromWrapper(wrapper);

            this.insertItem(itemIndex + 1, newWrapper);
          }
        },
        {
          id: "remove",
          type: "button",
          icon: "nc-trash",
          title: t("Delete"),
          position: 250,
          onChange: () => {
            hideToolbar();
            this.removeItem(itemIndex);
          }
        }
      ],
      getItemsForTablet: () => [],
      getItemsForMobile: () => []
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig(cloneRemoveConfig);

    return {
      meta,
      toolbarExtend
    };
  }

  renderItemWrapper(item, itemKey, itemIndex) {
    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);

    const shortcutsTypes = [
      "duplicate",
      "copy",
      "paste",
      "pasteStyles",
      "delete"
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
    if (IS_PREVIEW) {
      return <div className={this.props.className}>{items}</div>;
    }

    if (items.length === 0) {
      return (
        <div
          className={this.props.className}
          style={{ fontSize: this.state.fontSize }}
          ref={this.elementRef}
        >
          <SortableEmpty
            path={this.getPath()}
            type="section"
            acceptElements={["row", "column", "shortcode", "addable"]}
          />
        </div>
      );
    }

    return (
      <Sortable
        path={this.getPath()}
        type="section"
        acceptElements={["row", "column", "shortcode", "addable"]}
      >
        <div
          className={this.props.className}
          style={{ fontSize: this.state.fontSize }}
          ref={this.elementRef}
        >
          {items}
        </div>
      </Sortable>
    );
  }
}

export default StoryItemItems;
