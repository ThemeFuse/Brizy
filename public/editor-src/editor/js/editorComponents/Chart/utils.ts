import { Num, Str } from "@brizy/readers";
import { ChartInstanceType } from "visual/types/global";
import { hexToRgba } from "visual/utils/color";
import { camelCase } from "visual/utils/string";
import { MValue } from "visual/utils/value";
import {
  ChartData as ChartDataType,
  ChartDataValue,
  ChartType,
  Switch,
  Value,
  readChartItems
} from "./types";

export const splitNumber = (text = ""): MValue<number[]> =>
  text?.split(", ").map((item) => Num.read(item) ?? 0);

export const getLineOrBarData = (
  chartItems: ChartDataValue[],
  label: string,
  borderWidth: number,
  fill: Switch
): ChartDataType<ChartType.line> | ChartDataType<ChartType.bar> => {
  const data = chartItems.map((item) => ({
    label: item.label,
    borderColor: hexToRgba(item.color.hex, item.color.opacity),
    backgroundColor: hexToRgba(item.color.hex, 0.5),
    data: splitNumber(item.value) ?? [],
    borderWidth,
    fill: fill === "on"
  }));

  return {
    labels: label.split(", "),
    datasets: data
  };
};

export const getPieData = (
  chartPieItems: ChartDataValue[],
  borderWidth: number,
  borderColor: string
) => {
  const labels = chartPieItems.map((item) => item.label);
  const data = chartPieItems.map((item) => Num.read(item.value) ?? 0);
  const backgroundColor = chartPieItems.map((item) =>
    hexToRgba(item.color.hex, item.color.opacity)
  );

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderColor,
        borderWidth
      }
    ]
  };
};

interface ChartValue {
  chartType: ChartType;
  items: ChartDataValue[];
  borderWidth: number;
  borderColor: string;
  label: string;
  borderSize: number;
  fill: Switch;
}

export const getChart = (
  value: ChartValue,
  item: HTMLCanvasElement,
  Chart: ChartInstanceType
) => {
  const {
    chartType,
    items,
    borderWidth,
    borderColor,
    label,
    borderSize,
    fill
  } = value;

  switch (chartType) {
    case ChartType.pie:
      return new Chart(item, {
        type: chartType,
        data: getPieData(items, borderWidth, borderColor),
        options: {
          animation: {
            duration: 0
          }
        }
      });
    case ChartType.line:
    case ChartType.bar: {
      return new Chart(item, {
        type: chartType,
        data: getLineOrBarData(items, label, borderSize, fill)
      });
    }
  }
};

export const getChartItems = (v: Value, prefix: string): ChartDataValue[] => {
  const items = readChartItems(v[prefix]) ?? [];

  return items.map(({ id, title }) => {
    const hex = Str.read(v[camelCase([prefix, id, "colorHex"])]) ?? "";
    const opacity = Num.read(v[camelCase([prefix, id, "colorOpacity"])]) ?? 1;

    const value = Str.read(v[camelCase([prefix, id, "value"])]) ?? "";

    return {
      label: title,
      value,
      color: {
        hex,
        opacity
      }
    };
  });
};
