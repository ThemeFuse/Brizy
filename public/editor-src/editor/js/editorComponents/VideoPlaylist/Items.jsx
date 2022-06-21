import { removeAt } from "timm";
import { noop } from "underscore";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { hideToolbar } from "visual/component/Toolbar/index";
import { t } from "visual/utils/i18n";

class VideoPlaylistItems extends EditorArrayComponent {
  static get componentId() {
    return "VideoPlaylist.Items";
  }

  static defaultProps = {
    meta: {},
    onActiveChange: noop
  };

  getItemProps(itemData, itemIndex, items) {
    const cloneRemoveConfig = {
      getItems: () => [
        {
          id: "order",
          type: "order-dev",
          devices: "desktop",
          position: 105,
          roles: ["admin"],
          disabled: items.length < 2,
          config: {
            align: "vertical",
            disable:
              itemIndex === 0
                ? "prev"
                : itemIndex === items.length - 1
                ? "next"
                : undefined,
            onChange: v => {
              switch (v) {
                case "prev":
                  this.reorderItem(itemIndex, itemIndex - 1);
                  break;
                case "next":
                  this.reorderItem(itemIndex, itemIndex + 1);
                  break;
              }
            }
          }
        },
        {
          id: "duplicate",
          type: "button",
          devices: "desktop",
          icon: "nc-duplicate",
          title: t("Duplicate"),
          position: 225,
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
          disabled: items.length === 1,
          onChange: () => {
            hideToolbar();
            this.removeItem(itemIndex);
          }
        }
      ]
    };

    return {
      meta: this.props.meta,
      active: this.props.currentIndex === itemIndex,
      toolbarExtend: this.makeToolbarPropsFromConfig2(cloneRemoveConfig),
      onActiveItem: () => {
        this.props.onActiveChange(itemIndex);
      }
    };
  }

  removeItem(itemIndex) {
    const dbValue = this.getDBValue() || [];
    const updatedValue = removeAt(dbValue, itemIndex);

    setTimeout(() => {
      this.handleValueChange(updatedValue, { arrayOperation: "remove" });
    }, 0);
  }
}

export default VideoPlaylistItems;
