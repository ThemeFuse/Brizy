import React, { FC } from "react";
import classNames from "classnames";
import ColorPicker2 from "visual/component/Controls/ColorPicker2";
import { ColorPalette } from "visual/component/Controls/ColorPalette";
import { WithClassName, WithValue } from "visual/utils/options/attributes";
import { PaletteObject } from "visual/component/Controls/ColorPalette/entities/PaletteObject";

export const paletteHex = (
  id: PaletteObject["id"],
  palettes: PaletteObject[]
): string | undefined => palettes.find(p => p.id === id)?.hex;

const getHex = (
  hex: string,
  palette: PaletteObject["id"],
  palettes: PaletteObject[]
): string => paletteHex(palette, palettes) || hex;

export type Value = {
  hex: string;
  opacity: number;
  palette: string;
};

export type Meta = {
  isChanged: "palette" | "opacity" | "hex";
  opacityDragEnd?: boolean;
};

export type Props = WithClassName &
  WithValue<Value> & {
    opacity: boolean;
    palette: PaletteObject[];
    paletteOpenSettings: () => void;
    value: Value;
    onChange: (v: Value, m: Meta) => void;
  };

export const ColorPicker3: FC<Props> = ({
  className: _className,
  opacity = true,
  palette = [],
  paletteOpenSettings,
  value,
  onChange
}) => {
  const className = classNames("brz-ed-control__colorPicker3", _className);

  const colorValue = {
    opacity: value.opacity,
    hex: getHex(value.hex, value.palette, palette)
  };

  const onColorChange = ({
    hex,
    opacity,
    isChanged,
    opacityDragEnd
  }: {
    hex: string;
    opacity: number;
    isChanged: Meta["isChanged"];
    opacityDragEnd: Meta["opacityDragEnd"];
  }): void => {
    onChange(
      { hex, opacity, palette: value.palette },
      { isChanged, opacityDragEnd }
    );
  };

  const onPaletteChange = (id: PaletteObject["id"]): void => {
    onChange({ ...value, palette: id }, { isChanged: "palette" });
  };

  return (
    <div className={className}>
      <ColorPicker2
        value={colorValue}
        disableOpacity={!opacity}
        onChange={onColorChange}
      />
      <ColorPalette
        palette={palette}
        onChange={onPaletteChange}
        openSettings={paletteOpenSettings}
        value={value.palette}
      />
    </div>
  );
};
