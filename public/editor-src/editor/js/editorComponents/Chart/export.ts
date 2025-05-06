import { Num } from "@brizy/readers";
import { getProLibs } from "visual/libs";
import { checkValue2 } from "visual/utils/checkValue";
import { parseFromString } from "visual/utils/string";
import { ChartType, readChartDataValues } from "./types";
import { getChart } from "./utils";

export default function ($node: JQuery) {
  const node = $node.get(0);

  if (!node) {
    return;
  }

  node.querySelectorAll<HTMLElement>(".brz-chart").forEach((chart) => {
    const {
      chartType,
      items,
      borderColor,
      borderWidth,
      label,
      fill,
      borderSize
    } = chart.dataset;

    const chartItems = parseFromString(items ?? "");
    const borderWidthValue = Num.read(borderWidth) ?? 0;
    const borderColorValue = borderColor ?? "";
    const borderSizeValue = Num.read(borderSize) ?? 0;
    const labelValue = label ?? "";
    const fillValue = fill === "on" ? "on" : "off";
    const chartTypeValue = checkValue2(ChartType)(chartType);

    const chartItem = chart.querySelector("canvas");
    const _items = readChartDataValues(chartItems);

    const { Chart } = getProLibs();

    if (!chartTypeValue || !chartItem || !_items || !Chart) {
      return;
    }

    getChart(
      {
        chartType: chartTypeValue,
        items: _items,
        borderWidth: borderWidthValue,
        borderColor: borderColorValue,
        borderSize: borderSizeValue,
        label: labelValue,
        fill: fillValue
      },
      chartItem,
      Chart
    );
  });
}
