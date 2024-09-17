import { memoize } from "underscore";
import { BoxResizerParams } from "visual/editorComponents/Form2/types";
import { checkValue } from "visual/utils/checkValue";
import { ViewType } from "./Form2Steps/types";

export const isViewType = (v: string): v is ViewType =>
  !!checkValue<ViewType>([
    ViewType.None,
    ViewType.Text,
    ViewType.Icon,
    ViewType.Number,
    ViewType.Progress,
    ViewType.NumberText,
    ViewType.IconText
  ])(v);

export const isViewTypeWithIcon = (v: ViewType): boolean =>
  v === ViewType.Icon || v === ViewType.IconText;

export const isViewTypeWithNumber = (v: ViewType): boolean =>
  v === ViewType.Number || v === ViewType.NumberText;

export const getBoxResizerParams: BoxResizerParams = memoize(() => ({
  points: ["centerLeft", "centerRight"],
  restrictions: {
    width: {
      "%": { min: 5, max: 100 }
    }
  }
}));
