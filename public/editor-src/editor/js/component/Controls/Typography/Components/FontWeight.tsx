import React from "react";
import { Select2 } from "visual/component/Controls/Select2";
import { Item } from "visual/component/Controls/Select2/Item";
import { VariationFont } from "visual/component/Controls/Typography/Components/VariationFont";
import { Label } from "visual/component/Label";
import { Weight } from "visual/utils/fonts/Weight";
import { FontWeightProps as Props } from "../types/Props";

export const FontWeight = ({
  label,
  weight,
  variableFontWeight,
  fontWidth,
  fontSoftness,
  weights,
  variations,
  onFontWeightChange,
  onVariableFontWeightChange,
  onFontWidthChange,
  onSoftnessChange
}: Props): JSX.Element => {
  return (
    <div className="brz-ed__col brz-ed__col-1-2 brz-ed-control__typography-font-weight">
      <Label title={label}>{label}</Label>
      {variations ? (
        <VariationFont
          variableFontWeight={variableFontWeight}
          fontWidth={fontWidth}
          fontSoftness={fontSoftness}
          variations={variations}
          onVariableFontWeightChange={onVariableFontWeightChange}
          onFontWidthChange={onFontWidthChange}
          onSoftnessChange={onSoftnessChange}
        />
      ) : (
        <Select2<Weight>
          value={weight}
          onChange={onFontWeightChange}
          editable={false}
          size="auto"
        >
          {weights.map(({ value, title }) => (
            <Item key={value} value={value}>
              {title}
            </Item>
          ))}
        </Select2>
      )}
    </div>
  );
};
