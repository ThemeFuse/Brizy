import { noop } from "es-toolkit";
import { removeAt } from "timm";
import { hideToolbar } from "visual/component/Toolbar/index";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { t } from "visual/utils/i18n";

class VideoPlaylistItems extends EditorArrayComponent {
  static get componentId() {
    return "VideoPlaylist.Items";
  }

  static defaultProps = {
    meta: {},
    renderType: "",
    onActiveChange: noop
  };

  getItemProps(itemData, itemIndex, items) {
    const cloneRemoveConfig = {
      getItems: () => [
        {
          id: "order",
          type: "order",
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
            onChange: (v) => {
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
          config: {
            icon: "nc-duplicate",
            title: t("Duplicate"),
            reverseTheme: true
          },
          position: 225,
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
          disabled: items.length === 1,
          onClick: () => {
            hideToolbar();
            this.removeItem(itemIndex);
          }
        }
      ]
    };

    return {
      meta: this.props.meta,
      renderType: this.props.renderType,
      active: this.props.currentIndex === itemIndex,
      toolbarExtend: this.makeToolbarPropsFromConfig2(cloneRemoveConfig),
      onClick: () => {
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
