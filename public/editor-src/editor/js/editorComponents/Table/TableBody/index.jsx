import classnames from "classnames";
import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Items from "./Items";
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
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
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
