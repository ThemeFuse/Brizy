import classnames from "classnames";
import React, { ReactNode } from "react";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { ElementModel } from "visual/component/Elements/Types";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent, {
  ToolbarExtend
} from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import Items from "./items";
import { style } from "./styles";
import * as toolbar from "./toolbar";

export interface Value extends ElementModel {
  name: string;
  type: string;
  labelText: string;
  customClassName: string;

  bgColorHex: string;
  bgColorPalette: string;
  bgColorOpacity: number;

  colorHex: string;
  colorPalette: string;
  colorOpacity: number;
}

interface Props {
  verticalMode: string;
  timelineStyle: string;
  toolbarExtendLabel: ToolbarExtend;
}

export default class TimelineTab extends EditorComponent<Value, Props> {
  static get componentId(): "TimelineTab" {
    return "TimelineTab";
  }

  static defaultValue = defaultValue;

  handleLabelChange = (labelText: string): void => {
    this.patchValue({ labelText });
  };

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { customClassName, labelText, name, type } = v;
    const { verticalMode, timelineStyle, toolbarExtendLabel, meta } =
      this.props;

    const itemProps = this.makeSubcomponentProps({
      className: "brz-timeline__content brz-d-xs-flex brz-flex-xs-column",
      bindWithKey: "items",
      itemProps: { meta }
    });

    const className = classnames(
      "brz-timeline__tab",
      `brz-timeline__tab--${timelineStyle}`,
      verticalMode === "on"
        ? "brz-timeline__tab--vertical"
        : "brz-timeline__tab--horizontal",
      customClassName,
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
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
        {
          // @ts-expect-error: Need transform to ts
          <Items {...itemProps} />
        }
      </div>
    );
  }
}
