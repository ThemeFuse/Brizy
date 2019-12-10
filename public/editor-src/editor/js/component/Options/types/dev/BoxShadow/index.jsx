import React from "react";
import T from "prop-types";
import classNames from "classnames";
import { getStore } from "visual/redux/store";
import { updateUI } from "visual/redux/actions";
import {
  getColorPaletteColor,
  getColorPaletteColors
} from "visual/utils/color";
import { BoxShadow as ShadowControl } from "visual/component/Controls/BoxShadow";
import { toHex } from "visual/utils/color/isHex";
import { toBlur, toSpread } from "visual/utils/cssProps";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import { toNumber } from "visual/utils/math";
import {
  getSetter,
  getTypesItems,
  getConfig,
  _setOpacity,
  fromModel
} from "./utils";
import { get } from "visual/utils/model";
import * as Type from "visual/component/Options/types/dev/BoxShadow/entities/type";
import { toOpacity } from "visual/utils/cssProps/opacity";

const openPaletteSidebar = () => {
  getStore().dispatch(
    updateUI("leftSidebar", {
      isOpen: true,
      drawerContentType: "styling"
    })
  );
};

export const BoxShadow = ({ onChange, value, ...props }) => {
  const className = classNames("brz-ed-option__boxShadow", props.className);
  const onValueChange = (m, meta = {}) => {
    if (meta.isChanged === "opacity") {
      // Opacity has a special cas where we need to update tempOpacity when the slider drag ends

      onChange(
        fromModel(
          _setOpacity(
            get(undefined, "opacity", m),
            value,
            !!meta.opacityDragEnd
          )
        ),
        meta
      );
    } else {
      const setter = getSetter(meta.isChanged);

      if (setter) {
        onChange(
          fromModel(setter(get(undefined, meta.isChanged, m), value)),
          meta
        );
      }
    }
  };

  return (
    <ShadowControl
      opacity={config(props.config, "opacity")}
      className={className}
      value={value}
      onChange={onValueChange}
      types={getTypesItems()}
      palette={getColorPaletteColors()}
      paletteOpenSettings={openPaletteSidebar}
    />
  );
};

/**
 * @param {(function(key: string): string|number)} get
 * @returns {{}}
 */
BoxShadow.getModel = get => {
  const value = get("value");
  const tValue = get("tempValue");

  const type = value === "" ? Type.NONE : value === "on" ? Type.OUTSET : value;
  const tType =
    tValue === "" ? Type.NONE : tValue === "on" ? Type.OUTSET : tValue;
  const palette = Palette.toPalette(
    get("palette") || Palette.empty,
    get("colorPalette")
  );
  const hex = (getColorPaletteColor(palette) || {}).hex;

  return {
    type: Type.toType(get("type") || Type.empty, type),
    tempType: Type.toType(get("tempType") || Type.INSET, tType),
    hex: toHex(get("colorHex") || get("hex") || "#000000", hex),
    opacity: toOpacity(get("opacity") || 0, get("colorOpacity")),
    tempOpacity: toOpacity(get("tempOpacity") || 1, get("tempColorOpacity")),
    palette: palette,
    tempPalette: Palette.toPalette(
      get("tempPalette") || Palette.empty,
      get("tempColorPalette")
    ),
    blur: toBlur(0, get("blur")),
    tempBlur: toBlur(4, get("tempBlur")),
    spread: toSpread(0, get("spread")),
    tempSpread: toSpread(2, get("tempSpread")),
    vertical: toNumber(0, get("vertical")),
    tempVertical: toNumber(0, get("tempVertical")),
    horizontal: toNumber(0, get("horizontal")),
    tempHorizontal: toNumber(0, get("tempHorizontal"))
  };
};

BoxShadow.propTypes = {
  className: T.string,
  config: T.shape({
    opacity: T.bool
  }),
  value: T.shape({
    type: T.oneOf(Type.types),
    tempType: T.string,
    hex: T.string,
    opacity: T.number,
    tempOpacity: T.number,
    palette: T.oneOf(Palette.palettes),
    tempPalette: T.oneOf(Palette.palettes),
    blur: T.number,
    tempBlur: T.number,
    spread: T.number,
    tempSpread: T.number,
    vertical: T.number,
    tempVertical: T.number,
    horizontal: T.number,
    tempHorizontal: T.number
  }),
  onChange: T.func.isRequired
};

BoxShadow.defaultProps = {
  className: "",
  config: {
    opacity: true
  },
  value: {}
};

/**
 * @param {{opacity: boolean}} config
 * @param {string} key
 * @return {*}
 */
const config = (config, key) => getConfig(BoxShadow.defaultProps, config, key);
