import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import defaultValue from "./defaultValue.json";

const HEAD_ITEM_INDEX = 0;
const ASIDE_ITEM_INDEX = 1;

class TableRow extends EditorComponent {
  static get componentId() {
    return "TableRow";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  renderForEdit() {
    const { meta, toolbarExtend } = this.props;
    const headProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: HEAD_ITEM_INDEX,
      sliceEndIndex: ASIDE_ITEM_INDEX,
      itemProps: { meta, toolbarExtend }
    });
    const asideProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: ASIDE_ITEM_INDEX,
      sliceEndIndex: meta.table.columns + 1,
      itemProps: { meta, toolbarExtend }
    });

    const head = <EditorArrayComponent {...headProps} />;
    const body = <EditorArrayComponent {...asideProps} />;

    return (
      <tr className="brz-table__tr">
        {meta.table.showAside && head}
        {body}
      </tr>
    );
  }
}

export default TableRow;
