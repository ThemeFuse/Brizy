import { Arr, Num, Obj, Str, pipe } from "@brizy/readers";
import { ChartData as ChartDataType } from "chart.js";
import { mPipe, parseStrict } from "fp-utilities";
import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { WithClassName } from "visual/types/attributes";
import { onNullish } from "visual/utils/value";

export enum ChartType {
  pie = "pie",
  bar = "bar",
  line = "line"
}

export enum Unit {
  percentage = "%",
  px = "px"
}

export type Switch = "on" | "off";

export interface ChartItem {
  id: string;
  title: string;
}

export interface ChartDataValue {
  label: string;
  value: string;
  color: {
    hex: string;
    opacity: number;
  };
}

export interface Value extends ElementModel {
  titleText: string;
  barLabel: string;
  lineLabel: string;
  chartType: ChartType;
  chartBarItems: ChartItem[];
  chartPieItems: ChartItem[];
  chartLineItems: ChartItem[];
  borderSize: number;
  width: number;
  widthSuffix: Unit;
  fill: Switch;
  tabletWidth: number;
  tabletWidthSuffix: Unit;
  mobileWidth: number;
  mobileWidthSuffix: Unit;
  borderWidth: number;
  borderColor: string;
  customCSS: string;
  borderColorHex: string;
  borderColorPalette: string;
  borderColorOpacity: number;
}

export interface Props extends WithClassName {
  meta: ComponentsMeta;
  dbValue: Value;
}

export type ChartData<T extends ChartType> = ChartDataType<T, number[], string>;

const readChartItem = parseStrict<unknown, ChartItem>({
  id: pipe(mPipe(Obj.read, Obj.readKey("id"), Str.read), onNullish("")),
  title: pipe(mPipe(Obj.read, Obj.readKey("title"), Str.read), onNullish(""))
});

export const readChartItems = pipe(
  Arr.read,
  Arr.readWithItemReader(readChartItem)
);

const readChartDataValueColor = parseStrict<unknown, ChartDataValue["color"]>({
  hex: pipe(mPipe(Obj.read, Obj.readKey("hex"), Str.read), onNullish("")),
  opacity: pipe(mPipe(Obj.read, Obj.readKey("opacity"), Num.read), onNullish(0))
});

const readChartDataValue = parseStrict<unknown, ChartDataValue>({
  label: pipe(mPipe(Obj.read, Obj.readKey("label"), Str.read), onNullish("")),
  value: pipe(mPipe(Obj.read, Obj.readKey("value"), Str.read), onNullish("")),
  color: pipe(
    mPipe(Obj.read, Obj.readKey("color"), readChartDataValueColor),
    onNullish({ hex: "", opacity: 0 })
  )
});

export const readChartDataValues = pipe(
  Arr.read,
  Arr.readWithItemReader(readChartDataValue)
);
