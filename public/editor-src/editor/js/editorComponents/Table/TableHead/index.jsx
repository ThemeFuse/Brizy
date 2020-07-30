import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import defaultValue from "./defaultValue.json";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";
import classnames from "classnames";
import * as toolbarExtendConfig from "./toolbar";
import * as sidebarExtendConfig from "./sidebar";

class TableHead extends EditorComponent {
  static get componentId() {
    return "TableHead";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  renderForEdit(v, vs, vd) {
    const className = classnames(
      "brz-table__head",
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );
    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        meta: this.props.meta,
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtendConfig,
          sidebarExtendConfig,
          {
            allowExtend: false
          }
        )
      }
    });

    return (
      <thead className={className}>
        <EditorArrayComponent {...itemProps} />
      </thead>
    );
  }
}

export default TableHead;
