import { noop } from "es-toolkit";
import React, { ReactNode } from "react";
import { TextEditor } from "visual/component/Controls/TextEditor";
import CustomCSS from "visual/component/CustomCSS";
import { getChartItems } from "visual/editorComponents/Chart/utils";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { hexToRgba } from "visual/utils/color";
import { capByPrefix, encodeToString } from "visual/utils/string";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";
import * as toolbarTitleConfig from "./toolbarTitle";
import { ChartType, Props, Value } from "./types";

class Chart extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.Chart {
    return ElementTypes.Chart;
  }

  getAttributes(): Record<string, string> {
    const {
      fill,
      barLabel,
      lineLabel,
      borderColorHex,
      borderColorOpacity,
      chartType,
      borderSize,
      borderWidth
    } = this.getValue();

    const borderColor = hexToRgba(borderColorHex, borderColorOpacity);

    switch (chartType) {
      case ChartType.pie:
        return {
          "data-border-color": borderColor ?? "",
          "data-border-width": `${borderWidth}`
        };
      case ChartType.bar:
        return {
          "data-label": barLabel,
          "data-border-size": `${borderSize}`
        };
      case ChartType.line:
        return {
          "data-label": lineLabel,
          "data-fill": fill,
          "data-border-size": `${borderSize}`
        };
    }
  }

  renderForView(v: Value): ReactNode {
    const { customCSS, titleText, chartType } = v;

    const className = this.getCSSClassnames({
      toolbars: [toolbarConfig, toolbarTitleConfig],
      sidebars: [sidebarConfig],
      extraClassNames: ["brz-chart"]
    });

    const chartTypeItemsKey = capByPrefix("chart", `${chartType}Items`);
    const chartItems = encodeToString(getChartItems(v, chartTypeItemsKey));

    const attributes = {
      "data-chart-type": chartType,
      "data-items": chartItems,
      ...this.getAttributes()
    };

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <Wrapper
          {...this.makeWrapperProps({
            className,
            attributes
          })}
        >
          <TextEditor
            value={titleText}
            className="brz-chart_title"
            onChange={noop}
          />
          <canvas />
        </Wrapper>
      </CustomCSS>
    );
  }
}

export default Chart;
