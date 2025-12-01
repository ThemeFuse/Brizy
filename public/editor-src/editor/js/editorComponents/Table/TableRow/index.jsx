import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import defaultValue from "./defaultValue.json";

const HEAD_ITEM_INDEX = 0;
const ASIDE_ITEM_INDEX = 1;

class TableRow extends EditorComponent {
  static get componentId() {
    return ElementTypes.TableRow;
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  renderForEdit() {
    const { meta, toolbarExtend, isFromBody, showHead, widthType } = this.props;
    const { showAside } = meta.table;

    const headProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: HEAD_ITEM_INDEX,
      sliceEndIndex: ASIDE_ITEM_INDEX,
      itemProps: (itemData, itemIndex) => {
        return {
          meta,
          toolbarExtend,
          isFromBody,
          widthType,
          showHead,
          isFirstItem: showAside ? itemIndex === 0 : undefined
        };
      }
    });

    const asideProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: ASIDE_ITEM_INDEX,
      sliceEndIndex: meta.table.columns + 1,
      itemProps: {
        meta,
        toolbarExtend,
        widthType,
        showHead
      }
    });

    const head = <EditorArrayComponent {...headProps} />;
    const body = <EditorArrayComponent {...asideProps} />;

    return (
      <tr className="brz-table__tr">
        {showAside && head}
        {body}
      </tr>
    );
  }
}

export default TableRow;
