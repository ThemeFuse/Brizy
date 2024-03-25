import classNames from "classnames";
import React from "react";
import { ColorPalette } from "visual/component/Controls/ColorPalette";
import { PaletteObject } from "visual/component/Controls/ColorPalette/entities/PaletteObject";
import ColorPicker2 from "visual/component/Controls/ColorPicker2";
import { WithClassName, WithValue } from "visual/utils/options/attributes";

export const paletteHex = (
  id: PaletteObject["id"],
  palettes: PaletteObject[]
): string | undefined => palettes.find((p) => p.id === id)?.hex;

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
  isChanging?: boolean;
};

export type Props = WithClassName &
  WithValue<Value> & {
    opacity: boolean;
    palette?: PaletteObject[];
    paletteOpenSettings?: () => void;
    value: Value;
    onChange: (v: Value, m: Meta) => void;
  };

export const ColorPicker3 = ({
  className: _className,
  opacity = true,
  palette = [],
  paletteOpenSettings,
  value,
  onChange
}: Props): JSX.Element => {
  const className = classNames("brz-ed-control__colorPicker3", _className);

  const colorValue = {
    opacity: value.opacity,
    hex: getHex(value.hex, value.palette, palette)
  };

  const onColorChange = ({
    hex,
    opacity,
    isChanged,
    isChanging
  }: {
    hex: string;
    opacity: number;
    isChanged: Meta["isChanged"];
    isChanging: Meta["isChanging"];
  }): void => {
    onChange(
      { hex, opacity, palette: value.palette },
      { isChanged, isChanging }
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
      {palette.length ? (
        <ColorPalette
          palette={palette}
          onChange={onPaletteChange}
          openSettings={paletteOpenSettings}
          value={value.palette}
        />
      ) : null}
    </div>
  );
};
