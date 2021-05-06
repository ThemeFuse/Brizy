import React, { FC, useCallback } from "react";
import classNames from "classnames";
import { updateUI } from "visual/redux/actions2";
import {
  ColorPicker3,
  Props as ColorPicker3Props
} from "visual/component/Controls/ColorPicker3";
import { getColorPaletteColors as paletteColors } from "visual/utils/color";
import * as Palette from "./entities/palette";
import * as Num from "visual/utils/math/number";
import * as Hex from "visual/utils/color/Hex";
import { setHex, setPalette, setOpacity as _setOpacity } from "./model";
import * as Utils from "./utils";
import { ColorPickerInputs } from "visual/component/Controls/ColorPicketInputs";
import { paletteHex } from "./utils";
import {
  GetElementModel,
  GetModel,
  OptionType
} from "visual/component/Options/Type";
import * as Option from "visual/component/Options/Type";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { Value } from "./entities/Value";
import { useDispatch } from "react-redux";
import { Black } from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
import { mPipe } from "visual/utils/fp";
import * as Str from "visual/utils/string/specs";

const setOpacity = Utils.setOpacity.bind(null, _setOpacity);

export interface Config {
  opacity: boolean;
}

export interface Props
  extends Option.Props<Value>,
    WithConfig<Config>,
    WithClassName {
  attr?: Record<string, string>;
}

export const ColorPicker: OptionType<Value> & FC<Props> = ({
  className: _className,
  attr,
  onChange,
  value,
  config
}) => {
  const dispatch = useDispatch();
  const className = classNames(
    "brz-ed-option__colorPicker",
    _className,
    attr?.className
  );
  const openLeftSidebar = useCallback(
    () =>
      dispatch(
        updateUI("leftSidebar", {
          isOpen: true,
          drawerContentType: "styling"
        })
      ),
    [dispatch]
  );
  const _onChange = useCallback<ColorPicker3Props["onChange"]>(
    (v, meta) => {
      switch (meta.isChanged) {
        case "palette":
          mPipe(
            () => v.palette,
            Palette.fromString,
            v => setPalette(v, value),
            onChange
          )();
          break;
        case "hex":
          mPipe(
            () => v.hex,
            Hex.fromString,
            v => setHex(v, value),
            onChange
          )();
          break;
        case "opacity":
          mPipe(
            () => v.opacity,
            Opacity.fromNumber,
            v => setOpacity(v, value, !!meta.opacityDragEnd),
            onChange
          )();
          break;
      }
    },
    [value, onChange]
  );

  const onHexChange = useCallback(hex => onChange(setHex(hex, value)), [
    value,
    onChange
  ]);

  return (
    <div {...attr} className={className}>
      <ColorPicker3
        value={value}
        opacity={config?.opacity ?? true}
        onChange={_onChange}
        palette={paletteColors()}
        paletteOpenSettings={openLeftSidebar}
      />
      <ColorPickerInputs value={value.hex} onChange={onHexChange} />
    </div>
  );
};

const DEFAULT_VALUE: Value = {
  hex: Black,
  opacity: Opacity.unsafe(1),
  tempOpacity: Opacity.unsafe(1),
  palette: "",
  tempPalette: ""
};

const getModel: GetModel<Value> = get => {
  const palette =
    mPipe(() => get("palette"), Str.read, Palette.fromString)() ??
    DEFAULT_VALUE.palette;

  return {
    hex:
      paletteHex(palette, paletteColors()) ??
      mPipe(get, Str.read, Hex.fromString)("hex") ??
      DEFAULT_VALUE.hex,
    opacity:
      mPipe(() => get("opacity"), Num.read, Opacity.fromNumber)() ??
      DEFAULT_VALUE.opacity,
    palette: palette,
    tempOpacity:
      mPipe(() => get("tempOpacity"), Num.read, Opacity.fromNumber)() ??
      DEFAULT_VALUE.tempOpacity,
    tempPalette:
      mPipe(get, Str.read, Palette.fromString)("tempPalette") ??
      DEFAULT_VALUE.palette
  };
};

const getElementModel: GetElementModel<Value> = (values, get) => {
  return {
    [get("hex")]: values.hex,
    [get("opacity")]: values.opacity,
    [get("palette")]: values.palette,
    [get("tempOpacity")]: values.tempOpacity,
    [get("tempPalette")]: values.tempPalette
  };
};

ColorPicker.defaultValue = DEFAULT_VALUE;

ColorPicker.getModel = getModel;

ColorPicker.getElementModel = getElementModel;
