import { noop } from "es-toolkit";
import React, { ReactNode } from "react";
import { TextEditor } from "visual/component/Controls/TextEditor";
import CustomCSS from "visual/component/CustomCSS";
import { getChartItems } from "visual/editorComponents/Chart/utils";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { hexToRgba } from "visual/utils/color";
import { isVariableFont } from "visual/utils/options/Typography/utils";
import { DESKTOP } from "visual/utils/responsiveMode";
import { NORMAL } from "visual/utils/stateMode";
import { capByPrefix, encodeToString } from "visual/utils/string";
import { styleTypography2FontFamily } from "visual/utils/style2";
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

  getTypographyConfig() {
    const {
      dataLabelTypographyFontFamily,
      dataLabelTypographyFontSize,
      dataLabelTypographyFontWeight,
      dataLabelTypographyBold,
      dataLabelTypographyVariableFontWeight,
      dataLabelTypographyItalic,
      dataLabelTypographyUppercase,
      dataLabelTypographyLowercase
    } = this.getValue();

    const isVariableFontValue = isVariableFont(
      dataLabelTypographyFontFamily,
      this.getReduxStore()
    );

    const fontFamily = styleTypography2FontFamily({
      v: this.getValue(),
      device: DESKTOP,
      state: NORMAL,
      store: this.getReduxStore(),
      getConfig: () => this.getGlobalConfig(),
      renderContext: this.props.renderContext,
      prefix: "dataLabelTypography"
    });

    const fontWeight = isVariableFontValue
      ? dataLabelTypographyVariableFontWeight
      : dataLabelTypographyFontWeight;

    const dataLabelTypography = {
      fontFamily,
      fontSize: dataLabelTypographyFontSize ?? 12,
      fontWeight: dataLabelTypographyBold ? 700 : fontWeight,
      italic: dataLabelTypographyItalic ?? false,
      uppercase: dataLabelTypographyUppercase ?? false,
      lowercase: dataLabelTypographyLowercase ?? false
    };

    return dataLabelTypography;
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

    const dataLabelTypography = this.getTypographyConfig();

    const attributes = {
      "data-chart-type": chartType,
      "data-items": chartItems,
      ...this.getAttributes(),
      "data-label-typography": encodeToString(dataLabelTypography)
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
