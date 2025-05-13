import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { formControlSelector } from "./css/selectors";
import { Value } from "./types";

export const style = (data: DynamicStylesProps<Value>): OutputStyle => {
  const styles: Styles = {
    [`${formControlSelector}.form-control--checkbox .form-control__checkbox-view::after`]:
      {
        standart: [
          "cssStyleElementEcwidSearchCheckboxesBg",
          "cssStyleElementEcwidSearchCheckboxesGradient",
          "cssStyleElementEcwidSearchCheckboxesBorder"
        ]
      },
    [`${formControlSelector}.form-control--checkbox .form-control__checkbox:checked ~ .form-control__checkbox-view::after`]:
      {
        standart: [
          "cssStyleElementEcwidSearchCheckboxesActiveBg",
          "cssStyleElementEcwidSearchCheckboxesActiveGradient",
          "cssStyleElementEcwidSearchCheckboxesActiveBorder"
        ]
      },
    [`${formControlSelector}.form-control--radio .form-control__radio-view::after`]:
      {
        standart: ["cssStyleElementEcwidSearchRadioBorder"]
      },
    [`${formControlSelector}.form-control--radio .form-control__radio:checked ~ .form-control__radio-view::after`]:
      {
        standart: [
          "cssStyleElementEcwidSearchRadioActiveBg",
          "cssStyleElementEcwidSearchRadioActiveGradient",
          "cssStyleElementEcwidSearchRadioActiveBorder"
        ]
      }
  };

  return renderStyles({ ...data, styles });
};
