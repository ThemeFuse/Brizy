import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import defaultValue from "./defaultValue.json";
import { TextEditor } from "visual/component/Controls/TextEditor";
import ThemeIcon from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";
import classnames from "classnames";

class TableAside extends EditorComponent {
  static get componentId() {
    return "TableAside";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  handleLabelChange = labelText => {
    this.patchValue({ labelText });
  };

  renderForEdit(v, vs, vd) {
    const { name, type, labelText } = v;

    const className = classnames(
      "brz-table__th",
      "brz-table__aside",
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    return (
      <>
        <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
          <th className={className}>
            <div className="brz-table__th--btn">
              {name && type && <ThemeIcon name={name} type={type} />}
              <TextEditor value={labelText} onChange={this.handleLabelChange} />
            </div>
          </th>
        </Toolbar>
      </>
    );
  }
}

export default TableAside;
