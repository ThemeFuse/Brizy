import classnames from "classnames";
import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarExtendConfig from "./toolbar";
import Items from "./Items";

class TableBody extends EditorComponent {
  static get componentId() {
    return "TableBody";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  renderForEdit(v, vs, vd) {
    const { meta } = this.props;

    const className = classnames(
      "brz-table__body",
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceEndIndex: meta.table.rows,
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtendConfig,
        sidebarExtendConfig
      ),
      itemProps: {
        meta,
        isFromBody: true
      }
    });

    return (
      <tbody className={className}>
        <Items {...itemProps} />
      </tbody>
    );
  }
}

export default TableBody;
