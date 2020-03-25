import React from "react";
import T from "prop-types";
import { identity as id } from "underscore";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import * as BorderWidthType from "./entities/widthType";
import * as BorderStyle from "./entities/style";
import * as BorderModel from "./model";
import { fromElementModel, getStyleObject, toElementModel } from "./utils";
import { Border as Control } from "visual/component/Controls/Border";
import { openPaletteSidebar } from "visual/component/Options/types/dev/ColorPicker/store";
import {
  getColorPaletteColor,
  getColorPaletteColors
} from "visual/utils/color";
import * as ColorUtils from "visual/component/Options/types/dev/ColorPicker/utils";
import { get } from "visual/utils/model";
import { getConfig } from "visual/component/Options/types/dev/BoxShadow/utils";

const _setOpacity = ColorUtils.setOpacity.bind(
  undefined,
  BorderModel.setOpacity
);

export const Border = ({ value, onChange, className, config }) => {
  const styles = conf(config, "styles");
  const hasNone = styles.includes(BorderStyle.empty);
  const minWidth = hasNone ? id : v => Math.max(1, v);
  const _onChange = (m, meta = {}) => {
    let model = value;
    const key = meta.isChanged;
    const v = get(key, m);

    switch (key) {
      case "select":
        model = BorderModel.setStyle(v, value);
        break;
      case "opacity":
        model = _setOpacity(v, value, !!meta.opacityDragEnd);
        break;
      case "hex":
        model = BorderModel.setHex(v, value);
        break;
      case "palette":
        {
          const hex = get("hex", getColorPaletteColor(v));
          model = BorderModel.setHex(hex, value);
          model = BorderModel.setPalette(v, model);
        }
        break;
      case "widthType":
        model = BorderModel.setWidthType(v, value);
        break;
      case "width":
        model = BorderModel.setWidth(minWidth(v), value);
        break;
      case "topWidth":
        model = BorderModel.setTopWidth(minWidth(v), value);
        break;
      case "rightWidth":
        model = BorderModel.setRightWidth(minWidth(v), value);
        break;
      case "bottomWidth":
        model = BorderModel.setBottomWidth(minWidth(v), value);
        break;
      case "leftWidth":
        model = BorderModel.setLeftWidth(minWidth(v), value);
        break;
    }

    onChange(toElementModel(model), meta);
  };

  return (
    <Control
      className={className}
      value={value}
      onChange={_onChange}
      palette={getColorPaletteColors()}
      paletteOpenSettings={openPaletteSidebar}
      opacity={conf(config, "opacity")}
      styles={styles.map(getStyleObject).filter(Boolean)}
    />
  );
};

Border.getModel = fromElementModel;

Border.propTypes = {
  className: T.string,
  config: T.shape({
    opacity: T.bool,
    styles: T.arrayOf(T.oneOf(BorderStyle.styles))
  }),
  value: T.shape({
    style: T.oneOf(BorderStyle.styles),
    tempStyle: T.oneOf(BorderStyle.styles),
    hex: T.string,
    opacity: T.number,
    tempOpacity: T.number,
    palette: T.oneOf(Palette.palettes),
    tempPalette: T.oneOf(Palette.palettes),
    widthType: T.oneOf(BorderWidthType.types),
    width: T.number,
    tempWidth: T.number,
    topWidth: T.number,
    tempTopWidth: T.number,
    rightWidth: T.number,
    tempRightWidth: T.number,
    bottomWidth: T.number,
    tempBottomWidth: T.number,
    leftWidth: T.number,
    tempLeftWidth: T.number
  }).isRequired,
  onChange: T.func.isRequired
};

Border.defaultProps = {
  className: "",
  config: {
    opacity: true,
    styles: BorderStyle.styles
  }
};

/**
 * @param {{opacity: boolean}} config
 * @param {string} key
 * @return {*}
 */
const conf = (config, key) => getConfig(Border.defaultProps, config, key);
