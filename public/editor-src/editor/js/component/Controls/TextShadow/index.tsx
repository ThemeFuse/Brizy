import classNames from "classnames";
import React, { ReactElement, useCallback, useMemo } from "react";
import {
  Props as CProps,
  ColorPickerSelect
} from "visual/component/Controls/ColorPickerSelect";
import { ColorPickerInputs } from "visual/component/Controls/ColorPicketInputs";
import { Item } from "visual/component/Controls/MultiSelect/Item";
import MultiInputOptionType from "visual/component/Options/types/MultiInput";
import { Hex } from "visual/utils/color/Hex";
import {
  WithClassName,
  WithOnChange2,
  WithValue
} from "visual/utils/options/attributes";
import { PaletteObject } from "../ColorPalette/entities/PaletteObject";
import { Meta, Value } from "./types";
import { getModifiedField } from "./utils";

export interface Props<P, O>
  extends WithClassName,
    WithValue<Value<P, O>>,
    WithOnChange2<Value<P, O>, Meta<P, O>> {
  opacity: boolean;
  palette: PaletteObject[];
  paletteOpenSettings?: () => void;
  options: Array<{ id: O; title: string }>;
}

const multiInputConfig = {
  defaultIcon: "nc-shadow",
  icons: ["nc-blur", "nc-vertical", "nc-horizontal"]
};

export function TextShadow<P extends string, O extends string>({
  value,
  onChange,
  options,
  ...props
}: Props<P, O>): ReactElement {
  const className = classNames("brz-ed-control__textShadow", props.className);
  const onColorChange = useCallback<CProps<O>["onChange"]>(
    (v, m) => {
      onChange(
        {
          ...value,
          ...v,
          hex: v.hex as Hex, //TODO: Remove this cast
          palette: v.palette as P //TODO: Remove this cast
        },
        m
      );
    },
    [onChange, value]
  );
  const onHex = useCallback(
    (hex) => onChange({ ...value, hex }, { isChanged: "hex" }),
    [onChange]
  );
  const fieldChange = useCallback(
    (fields) => {
      const [blur, vertical, horizontal] = fields;
      const current = [value.blur, value.vertical, value.horizontal];
      const isChanged = getModifiedField(fields, current);
      if (isChanged) {
        onChange({ ...value, blur, vertical, horizontal }, { isChanged });
      }
    },
    [onChange, value]
  );
  const colorPickerValue = useMemo(
    (): CProps<O>["value"] => ({
      hex: value.hex,
      opacity: value.opacity,
      select: value.select,
      palette: value.palette ?? "" //TODO: Remove ""
    }),
    [value.hex, value.opacity, value.palette]
  );
  const multiInputValue = useMemo(
    () => [value.blur, value.vertical, value.horizontal],
    [value.blur, value.vertical, value.horizontal]
  );

  return (
    <div className={className}>
      <ColorPickerSelect<O>
        onChange={onColorChange}
        value={colorPickerValue}
        opacity={props.opacity}
        palette={props.palette}
        paletteOpenSettings={props.paletteOpenSettings}
      >
        {options.map(({ id, title }) => {
          return (
            <Item<Value<P, O>["select"]> value={id} key={id}>
              <span>{title}</span>
            </Item>
          );
        })}
      </ColorPickerSelect>
      <ColorPickerInputs value={value.hex} onChange={onHex}>
        <MultiInputOptionType
          config={multiInputConfig}
          value={multiInputValue}
          onChange={fieldChange}
        />
      </ColorPickerInputs>
    </div>
  );
}
