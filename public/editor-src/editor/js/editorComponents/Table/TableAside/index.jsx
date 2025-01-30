import classnames from "classnames";
import React from "react";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import toolbarConfigFn from "./toolbar";

class TableAside extends EditorComponent {
  static defaultProps = {
    meta: {}
  };
  static defaultValue = defaultValue;

  static get componentId() {
    return "TableAside";
  }

  handleLabelChange = (labelText) => {
    this.patchValue({ labelText });
  };

  renderForEdit(v, vs, vd) {
    const { name, type, filename, labelText } = v;
    const { showHead, isFromBody, isFirstItem, widthType } = this.props;

    const className = classnames(
      "brz-table__th",
      "brz-table__aside",
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

    const content = (
      <div className="brz-table__th--btn">
        {name && type && (
          <ThemeIcon name={name} type={type} filename={filename} />
        )}
        <TextEditor value={labelText} onChange={this.handleLabelChange} />
      </div>
    );

    const toolbar = toolbarConfigFn(
      !isFromBody && isFirstItem,
      widthType,
      isFromBody
    );

    return (
      <>
        <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar)}>
          {({ ref }) => (
            <th className={className} ref={ref}>
              {isFromBody || showHead ? content : null}
            </th>
          )}
        </Toolbar>
      </>
    );
  }
}

export default TableAside;
