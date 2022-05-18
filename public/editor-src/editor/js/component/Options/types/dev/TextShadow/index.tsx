import React, { FC, useCallback, useMemo } from "react";
import classNames from "classnames";
import { getColorPaletteColors } from "visual/utils/color";
import {
  TextShadow as ShadowControl,
  Props as ShadowProps
} from "visual/component/Controls/TextShadow";
import {
  Value as CValue,
  Meta as CMeta
} from "visual/component/Controls/TextShadow/types";
import { defaultValue, toElementModel, fromElementModel } from "./converters";
import { useDispatch } from "react-redux";
import { updateUI } from "visual/redux/actions2";
import * as Option from "visual/component/Options/Type";
import * as Value from "./types/Value";
import { WithClassName } from "visual/utils/options/attributes";
import { OptionType } from "visual/component/Options/Type";
import * as Utils from "./utils";
import { mPipe } from "visual/utils/fp";
import { Palette } from "visual/utils/color/Palette";
import {
  options,
  SelectType,
  selectTypeFromValue,
  valueFromSelectType
} from "./utils";

export interface Props extends Option.Props<Value.Value>, WithClassName {}

export const TextShadow: OptionType<Value.Value> & FC<Props> = ({
  onChange,
  value,
  className
}) => {
  const dispatch = useDispatch();
  const _className = classNames("brz-ed-option__textShadow", className);
  const onValueChange = useCallback<
    ShadowProps<Palette, SelectType>["onChange"]
  >(
    mPipe(
      (
        m: CValue<Palette, SelectType>,
        meta: CMeta<Palette, SelectType>
      ): Value.Value => {
        switch (meta.isChanged) {
          case "opacity": {
            return Value.setOpacity(m.opacity as Value.Value["opacity"], value);
          }
          case "blur": {
            return Value.setBlur(m.blur as Value.Value["blur"], value);
          }
          case "hex": {
            return Value.setHex(m.hex, value);
          }
          case "palette": {
            return m.palette ? Value.setPalette(m.palette, value) : value;
          }
          case "horizontal": {
            return Value.setHorizontal(m.horizontal, value);
          }
          case "vertical": {
            return Value.setVertical(m.vertical, value);
          }
          case "select":
            return valueFromSelectType(m.select, value);
        }
      },
      onChange
    ),
    [onChange, value]
  );
  const openPaletteSidebar = useCallback(
    () =>
      dispatch(
        updateUI("leftSidebar", {
          isOpen: true,
          drawerContentType: "styling"
        })
      ),
    [dispatch]
  );

  const shadowValue = useMemo<ShadowProps<Palette, SelectType>["value"]>(
    () => ({
      ...value,
      palette: Utils.getPalette(value),
      select: selectTypeFromValue(value)
    }),
    [value]
  );

  return (
    <ShadowControl<Palette, SelectType>
      opacity={true}
      className={_className}
      value={shadowValue}
      onChange={onValueChange}
      palette={getColorPaletteColors()}
      paletteOpenSettings={openPaletteSidebar}
      options={options}
    />
  );
};

TextShadow.fromElementModel = fromElementModel;

TextShadow.toElementModel = toElementModel;

TextShadow.defaultValue = defaultValue;
