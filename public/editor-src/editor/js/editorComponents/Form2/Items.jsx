import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";

class Form2Items extends EditorArrayComponent {
  static get componentId() {
    return "Form2.Items";
  }

  static defaultProps = {
    meta: {},
    inline: false,
    labelType: "inside",
    placeholder: false
  };

  renderItemWrapper(item, itemKey, itemIndex, itemData) {
    return itemData.type === "Button" ? (
      <div
        key={itemKey}
        className="brz-forms2__item brz-align-self-xs-end brz-forms2__item-button"
      >
        {item}
      </div>
    ) : (
      item
    );
  }
}

export default Form2Items;
