import classnames from "classnames";
import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import Items from "./Items";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarExtendConfig from "./toolbar";

class TableBody extends EditorComponent {
  static defaultProps = {
    meta: {}
  };
  static defaultValue = defaultValue;

  static get componentId() {
    return ElementTypes.TableBody;
  }

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
          contexts: this.getContexts()
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
