import React, { ReactNode, createRef } from "react";
import { TextEditor } from "visual/component/Controls/TextEditor";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { ChartType as ChartInstanceType } from "visual/types/global";
import { hexToRgba } from "visual/utils/color";
import { addFilter, applyFilter } from "visual/utils/filters";
import { isVariableFont } from "visual/utils/options/Typography/utils";
import { attachRefs } from "visual/utils/react";
import { capByPrefix } from "visual/utils/string";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";
import * as toolbarTitleConfig from "./toolbarTitle";
import { ChartType, Props, Value } from "./types";
import { getChart, getChartItems } from "./utils";

class Chart extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;

  chartRef = createRef<HTMLCanvasElement>();
  chart: ChartInstanceType | null = null;

  static get componentId(): ElementTypes.Chart {
    return ElementTypes.Chart;
  }

  handleChangeTitleText = (titleText: string): void => {
    this.patchValue({ titleText });
  };

  getChartLib() {
    return applyFilter("getLibs", {}).Chart;
  }

  initChart() {
    if (this.chartRef.current) {
      const ChartInstance = this.getChartLib();
      const chartData = this.getChartData();

      if (!ChartInstance) {
        return;
      }

      this.chart = getChart(chartData, this.chartRef.current, ChartInstance);
    }
  }

  componentDidMount(): void {
    this.initChart();
    document.fonts.ready.then(() => {
      if (this.chart) {
        this.chart.update();
      }
    });
    addFilter("initBrizyPro", () => this.initChart());
  }

  componentDidUpdate(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    this.initChart();
  }

  componentWillUnmount(): void {
    if (this.chartRef.current) {
      this.chartRef.current.remove();
    }

    if (this.chart) {
      this.chart.destroy();
    }
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

    const fontWeight = isVariableFontValue
      ? dataLabelTypographyVariableFontWeight
      : dataLabelTypographyFontWeight;

    const dataLabelTypography = {
      fontFamily: dataLabelTypographyFontFamily,
      fontSize: dataLabelTypographyFontSize ?? 12,
      fontWeight: dataLabelTypographyBold ? 700 : fontWeight,
      italic: dataLabelTypographyItalic ?? false,
      uppercase: dataLabelTypographyUppercase ?? false,
      lowercase: dataLabelTypographyLowercase ?? false
    };

    return dataLabelTypography;
  }

  getChartData() {
    const v = this.getValue();
    const {
      chartType,
      borderWidth,
      borderColorHex,
      lineLabel,
      barLabel,
      borderSize,
      fill,
      borderColorOpacity
    } = v;

    const itemsKey = capByPrefix("chart", `${chartType}Items`);
    const chartItems = getChartItems(v, itemsKey);

    const borderColor = hexToRgba(borderColorHex, borderColorOpacity) ?? "";

    const dataLabelTypography = this.getTypographyConfig();
    return {
      chartType,
      items: chartItems,
      borderWidth,
      borderColor,
      label: chartType === ChartType.bar ? barLabel : lineLabel,
      borderSize,
      fill,
      dataLabelTypography
    };
  }

  renderForEdit(v: Value): ReactNode {
    const { customCSS, titleText } = v;

    const className = this.getCSSClassnames({
      toolbars: [toolbarConfig, toolbarTitleConfig],
      sidebars: [sidebarConfig],
      extraClassNames: ["brz-chart"]
    });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref: mainToolbarRef }) => (
          <Toolbar
            selector=".brz-chart_title"
            {...this.makeToolbarPropsFromConfig2(toolbarTitleConfig)}
          >
            {({ ref: titleToolbarRef }) => (
              <CustomCSS selectorName={this.getId()} css={customCSS}>
                {({ ref: customCSSRef }) => (
                  <Wrapper
                    {...this.makeWrapperProps({
                      className,
                      ref: (el) =>
                        attachRefs(el, [
                          mainToolbarRef,
                          titleToolbarRef,
                          customCSSRef
                        ])
                    })}
                  >
                    <TextEditor
                      value={titleText}
                      className="brz-chart_title"
                      onChange={this.handleChangeTitleText}
                    />
                    <canvas ref={this.chartRef} />
                  </Wrapper>
                )}
              </CustomCSS>
            )}
          </Toolbar>
        )}
      </Toolbar>
    );
  }
}

export default Chart;
