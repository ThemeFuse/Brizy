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
  fill: Switch,
  textTransform: TextTransform
): ChartDataType<ChartType.line> | ChartDataType<ChartType.bar> => {
  const data = chartItems.map((item) => ({
    label: getTextTransform(item.label, textTransform),
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

type TextTransform = "uppercase" | "lowercase" | "none";

const getTextTransform = (text: string, textTransform: TextTransform) => {
  if (textTransform === "uppercase") return text.toUpperCase();
  if (textTransform === "lowercase") return text.toLowerCase();
  return text;
};

export const getPieData = (
  chartPieItems: ChartDataValue[],
  borderWidth: number,
  borderColor: string,
  textTransform: TextTransform
) => {
  const labels = chartPieItems.map((item) =>
    getTextTransform(item.label, textTransform)
  );
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

export interface TypographyConfig {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  italic?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
}

interface ChartValue {
  chartType: ChartType;
  items: ChartDataValue[];
  borderWidth: number;
  borderColor: string;
  label: string;
  borderSize: number;
  fill: Switch;
  dataLabelTypography?: TypographyConfig;
}

const buildFontConfig = (
  typography?: TypographyConfig
): Record<string, unknown> | undefined => {
  if (!typography) {
    return undefined;
  }

  const { fontFamily, fontSize, fontWeight, italic } = typography;

  // Build font style string
  const styleParts: string[] = [];
  if (italic) styleParts.push("italic");

  const fontStyle = styleParts.length > 0 ? styleParts.join(" ") : "normal";

  return {
    family: fontFamily,
    size: fontSize,
    style: fontStyle,
    weight: fontWeight?.toString() || "400"
  };
};

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
    fill,
    dataLabelTypography
  } = value;

  const fontConfig = buildFontConfig(dataLabelTypography);

  const baseOptions: Record<string, unknown> = {
    animation: {
      duration: 0
    }
  };

  if (fontConfig) {
    // Apply typography to legend labels (for pie charts) and axis labels (for bar/line charts)
    baseOptions.plugins = {
      legend: {
        labels: {
          font: fontConfig
        }
      }
    };

    if (chartType !== ChartType.pie) {
      baseOptions.scales = {
        x: {
          ticks: {
            font: fontConfig
          }
        },
        y: {
          ticks: {
            font: fontConfig
          }
        }
      };
    }
  }

  const textTransform = dataLabelTypography?.uppercase
    ? "uppercase"
    : dataLabelTypography?.lowercase
      ? "lowercase"
      : "none";

  switch (chartType) {
    case ChartType.pie:
      return new Chart(item, {
        type: chartType,
        data: getPieData(items, borderWidth, borderColor, textTransform),
        options: baseOptions
      });
    case ChartType.line:
    case ChartType.bar: {
      return new Chart(item, {
        type: chartType,
        data: getLineOrBarData(items, label, borderSize, fill, textTransform),
        options: baseOptions
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
