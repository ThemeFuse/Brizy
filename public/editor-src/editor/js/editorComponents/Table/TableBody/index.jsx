import classnames from "classnames";
import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarExtendConfig from "./toolbar";

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
        ),
        isFromBody: true
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
