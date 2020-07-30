import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import defaultValue from "./defaultValue.json";
import Items from "./items";

class TableCol extends EditorComponent {
  static get componentId() {
    return "TableCol";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  renderForEdit() {
    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      meta: this.props.meta
    });

    return (
      <td className="brz-table__td">
        <Items {...itemProps} />
      </td>
    );
  }
}

export default TableCol;
