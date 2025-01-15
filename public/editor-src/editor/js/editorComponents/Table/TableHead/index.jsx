import classnames from "classnames";
import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarExtendConfig from "./toolbar";

class TableHead extends EditorComponent {
  static get componentId() {
    return "TableHead";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  renderForEdit(v, vs, vd) {
    const { showHead, widthType, meta } = this.props;

    const className = classnames(
      "brz-table__head",
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

    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendConfig,
      sidebarExtendConfig,
      {
        allowExtend: true
      }
    );

    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        meta,
        toolbarExtend,
        showHead,
        widthType
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
