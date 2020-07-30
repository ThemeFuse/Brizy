import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { TextEditor } from "visual/component/Controls/TextEditor";
import Toolbar from "visual/component/Toolbar";
import ThemeIcon from "visual/component/ThemeIcon";
import defaultValue from "./defaultValue.json";
import Items from "./items";
import * as toolbar from "./toolbar";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";

export default class TimelineTab extends EditorComponent {
  static get componentId() {
    return "TimelineTab";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  handleLabelChange = labelText => {
    this.patchValue({ labelText });
  };

  renderForEdit(v, vs, vd) {
    const { customClassName, labelText, name, type } = v;
    const {
      verticalMode,
      timelineStyle,
      toolbarExtendLabel,
      meta
    } = this.props;
    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: { meta }
    });
    const className = classnames(
      "brz-timeline__tab",
      `brz-timeline__tab--${timelineStyle}`,
      verticalMode === "on"
        ? "brz-timeline__tabs--vertical"
        : "brz-timeline__tabs--horizontal",
      customClassName,
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    return (
      <div className={className}>
        <div className="brz-timeline__nav--title">
          <Toolbar {...toolbarExtendLabel}>
            <TextEditor value={labelText} onChange={this.handleLabelChange} />
          </Toolbar>
        </div>
        <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar)}>
          <div className="brz-timeline__nav--icon">
            <ThemeIcon name={name} type={type} />
          </div>
        </Toolbar>
        <div className="brz-timeline__content">
          <Items {...itemProps} />
        </div>
      </div>
    );
  }
}
