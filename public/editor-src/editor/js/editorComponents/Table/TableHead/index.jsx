import classnames from "classnames";
import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
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
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
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
