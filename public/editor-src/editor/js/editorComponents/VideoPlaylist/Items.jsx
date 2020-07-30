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
