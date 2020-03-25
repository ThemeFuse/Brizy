import React from "react";
import T from "prop-types";
import classNames from "classnames";
import { getColorPaletteColors } from "visual/utils/color";
import { BoxShadow as ShadowControl } from "visual/component/Controls/BoxShadow";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import {
  getSetter,
  getTypesItems,
  getConfig,
  _setOpacity,
  toElementModel,
  fromElementModel
} from "./utils";
import { get } from "visual/utils/model";
import * as Type from "visual/component/Options/types/dev/BoxShadow/entities/type";

import { openPaletteSidebar } from "visual/component/Options/types/dev/ColorPicker/store";

export const BoxShadow = ({ onChange, value, ...props }) => {
  const className = classNames("brz-ed-option__boxShadow", props.className);
  const onValueChange = (m, meta = {}) => {
    if (meta.isChanged === "opacity") {
      // Opacity has a special cas where we need to update tempOpacity when the slider drag ends

      onChange(
        toElementModel(
          _setOpacity(get("opacity", m), value, !!meta.opacityDragEnd)
        ),
        meta
      );
    } else {
      const setter = getSetter(meta.isChanged);

      if (setter) {
        onChange(toElementModel(setter(get(meta.isChanged, m), value)), meta);
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
BoxShadow.getModel = fromElementModel;

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
