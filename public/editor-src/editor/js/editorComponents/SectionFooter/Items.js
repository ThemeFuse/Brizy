import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Sortable from "visual/component-new/Sortable";
import { hideToolbar } from "visual/component-new/Toolbar";
import { t } from "visual/utils/i18n";

class SectionFooterItems extends EditorArrayComponent {
  static get componentId() {
    return "SectionFooter.Items";
  }

  static defaultProps = {
    className: "",
    meta: {}
  };

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
            this.cloneItem(itemIndex);
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

    return { meta, toolbarExtend };
  }

  renderItemsContainer(items) {
    if (IS_PREVIEW) {
      return <div className={this.props.className}>{items}</div>;
    }

    const sortableContent = items.length ? (
      <div className={this.props.className}>{items}</div>
    ) : null;

    return (
      <Sortable
        path={this.getPath()}
        type="section"
        acceptElements={["row", "column", "shortcode", "addable"]}
      >
        {sortableContent}
      </Sortable>
    );
  }
}

export default SectionFooterItems;
