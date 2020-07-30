import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import defaultValue from "./defaultValue.json";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";
import classnames from "classnames";
import * as toolbarExtendConfig from "./toolbar";
import * as sidebarExtendConfig from "./sidebar";

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
      itemProps: {
        meta,
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtendConfig,
          sidebarExtendConfig
        )
      }
    });

    return (
      <tbody className={className}>
        <EditorArrayComponent {...itemProps} />
      </tbody>
    );
  }
}

export default TableBody;
