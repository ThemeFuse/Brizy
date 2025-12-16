import classnames from "classnames";
import React, { ReactNode } from "react";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { ElementModel } from "visual/component/Elements/Types";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ToolbarExtend } from "visual/editorComponents/EditorComponent/types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import defaultValue from "./defaultValue.json";
import Items from "./items";
import { style } from "./styles";
import * as toolbar from "./toolbar";

export interface Value extends ElementModel {
  name: string;
  type: string;
  filename?: string;
  labelText: string;
  customClassName: string;

  bgColorHex: string;
  bgColorPalette: string;
  bgColorOpacity: number;

  colorHex: string;
  colorPalette: string;
  colorOpacity: number;
}

export interface Props {
  verticalMode: string;
  timelineStyle: string;
  toolbarExtendLabel: ToolbarExtend;
}

export default class TimelineTab extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.TimelineTab {
    return ElementTypes.TimelineTab;
  }

  handleLabelChange = (labelText: string): void => {
    this.patchValue({ labelText });
  };

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { customClassName, labelText, name, type, filename } = v;
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

    return (
      <Toolbar {...toolbarExtendLabel} selector=".brz-timeline__nav--title">
        {({ ref }) => (
          <div className={className} ref={ref}>
            <TextEditor
              value={labelText}
              onChange={this.handleLabelChange}
              className="brz-timeline__nav--title"
            />
            <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar)}>
              {({ ref }) => (
                <div className="brz-timeline__nav--icon" ref={ref}>
                  <ThemeIcon name={name} type={type} filename={filename} />
                </div>
              )}
            </Toolbar>
            {
              // @ts-expect-error: Need transform to ts
              <Items {...itemProps} />
            }
          </div>
        )}
      </Toolbar>
    );
  }
}
