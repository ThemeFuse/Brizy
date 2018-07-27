import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";

class Items extends EditorArrayComponent {
  static get componentId() {
    return "Wrapper.Items";
  }

  static defaultProps = {
    containerClassName: "",
    toolbarExtend: null,
    meta: {},
    itemProps: {}
  };

  getItemProps(itemData, itemIndex, items) {
    const { itemProps, meta, toolbarExtend } = this.props;

    return {
      ...itemProps,
      meta,
      toolbarExtend
    };
  }

  renderItemsContainer(items) {
    return <div className={this.props.containerClassName}>{items}</div>;
  }
}

export default Items;
