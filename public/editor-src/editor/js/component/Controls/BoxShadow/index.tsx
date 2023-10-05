import classNames from "classnames";
import React, { FC, useCallback } from "react";
import {
  Meta,
  TypeObject,
  Value
} from "visual/component/Controls/BoxShadow/types";
import { getModifiedField } from "visual/component/Controls/BoxShadow/utils";
import { ColorPickerSelect } from "visual/component/Controls/ColorPickerSelect";
import {
  Meta as CMeta,
  Value as CValue
} from "visual/component/Controls/ColorPickerSelect/entities";
import { ColorPickerInputs } from "visual/component/Controls/ColorPicketInputs";
import MultiInputOptionType from "visual/component/Controls/MultiInput";
import { Item } from "visual/component/Controls/Select2/Item";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import {
  WithClassName,
  WithOnChange2,
  WithValue
} from "visual/utils/options/attributes";
import { PaletteObject } from "../ColorPalette/entities/PaletteObject";

export interface Props
  extends WithClassName,
    WithValue<Value>,
    WithOnChange2<Value, Meta> {
  opacity: boolean;
  types: TypeObject[];
  palette: PaletteObject[];
  paletteOpenSettings?: () => void;
}

export const BoxShadow: FC<Props> = ({ value, types, onChange, ...props }) => {
  const className = classNames("brz-ed-control__boxShadow", props.className);
  const onHex = useCallback(
    (hex) => onChange({ ...value, hex }, { isChanged: "hex" }),
    [onChange, value]
  );
  const fieldChange = useCallback(
    (fields) => {
      const [blur, spread, vertical, horizontal] = fields;
      const current = [
        value.blur,
        value.spread,
        value.vertical,
        value.horizontal
      ];
      const isChanged = getModifiedField(fields, current);
      if (isChanged) {
        onChange(
          { ...value, blur, spread, vertical, horizontal },
          { isChanged }
        );
      }
    },
    [onChange, value]
  );
  const _onChange = (
    { select, ...v }: CValue<Value["type"]>,
    m: CMeta
  ): void => {
    onChange(
      {
        ...value,
        hex: v.hex,
        opacity: v.opacity,
        palette: v.palette as Palette.Palette,
        type: select
      },
      { ...m, isChanged: m.isChanged === "select" ? "type" : m.isChanged }
    );
  };

  return (
    <div className={className}>
      <ColorPickerSelect<Value["type"]>
        onChange={_onChange}
        value={{
          select: value.type,
          hex: value.hex,
          opacity: value.opacity,
          palette: value.palette
        }}
        opacity={props.opacity}
        palette={props.palette}
        paletteOpenSettings={props.paletteOpenSettings}
      >
        {types.map(({ id, title }) => {
          return (
            <Item<Value["type"]> value={id} key={id}>
              <span>{title}</span>
            </Item>
          );
        })}
      </ColorPickerSelect>
      <ColorPickerInputs value={value.hex} onChange={onHex}>
        <MultiInputOptionType
          config={{
            defaultIcon: "nc-shadow",
            icons: ["nc-blur", "nc-size", "nc-vertical", "nc-horizontal"]
          }}
          value={[value.blur, value.spread, value.vertical, value.horizontal]}
          onChange={fieldChange}
        />
      </ColorPickerInputs>
    </div>
  );
};
