import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";

class FormItems extends EditorArrayComponent {
  static get componentId() {
    return "Form.Items";
  }

  static defaultProps = {
    className: ""
  };

  getItemProps(itemData, itemIndex, items) {
    if (itemData.type === "Item") {
      return;
    }

    const { toolbarExtend } = this.props;
    return { toolbarExtend };
  }
}

export default FormItems;
