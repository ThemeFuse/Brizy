import React from "react";
import classnames from "classnames";
import { removeAt } from "timm";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { hideToolbar } from "visual/component/Toolbar/index";
import { t } from "visual/utils/i18n";

class VideoPlaylistItems extends EditorArrayComponent {
  static get componentId() {
    return "VideoPlaylist.Items";
  }

  static defaultProps = {
    className: "",
    style: {},
    meta: {}
  };

  getItemProps(itemData, itemIndex, items) {
    const { meta } = this.props;

    const className = classnames("brz-video-playlist-items");
    const cloneRemoveConfig = {
      getItemsForDesktop: () => [
        {
          id: "duplicate",
          type: "button",
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
          icon: "nc-trash",
          title: t("Delete"),
          position: 210,
          disabled: items.length === 1,
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
      className,
      toolbarExtend,
      itemIndex
    };
  }

  updateItem(itemIndex, itemValue, updateMeta = {}) {
    super.updateItem(itemIndex, itemValue, updateMeta);
  }

  removeItem(itemIndex) {
    const dbValue = this.getDBValue() || [];
    const updatedValue = removeAt(dbValue, itemIndex);

    setTimeout(() => {
      this.handleValueChange(updatedValue, { arrayOperation: "remove" });
    }, 0);
  }

  renderItemWrapper(item, itemKey, itemIndex) {
    const className = classnames("brz-video-playlist-item-container");
    return (
      <div
        className={className}
        key={itemKey}
        onClick={() => this.props.onActiveChange(itemIndex)}
      >
        {item}
      </div>
    );
  }

  renderItemsContainer(items) {
    const { style } = this.props;

    return (
      <div className="brz-video-playlist-list-video" style={style}>
        {items}
      </div>
    );
  }
}

export default VideoPlaylistItems;
