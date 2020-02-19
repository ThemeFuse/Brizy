import React from "react";
import T from "prop-types";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import * as BorderWidthType from "./entities/widthType";
import * as BorderStyle from "./entities/style";
import * as BorderModel from "./model";
import { fromElementModel, toElementModel } from "./utils";
import { Border as Control } from "visual/component/Controls/Border";
import { openPaletteSidebar } from "visual/component/Options/types/dev/ColorPicker/store";
import {
  getColorPaletteColor,
  getColorPaletteColors
} from "visual/utils/color";
import { t } from "visual/utils/i18n";
import * as ColorUtils from "visual/component/Options/types/dev/ColorPicker/utils";
import { get } from "visual/utils/model";
import { getConfig } from "visual/component/Options/types/dev/BoxShadow/utils";

const _setOpacity = ColorUtils.setOpacity.bind(
  undefined,
  BorderModel.setOpacity
);

export const Border = ({ value, onChange, className, config }) => {
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
        model = BorderModel.setWidth(v, value);
        break;
      case "topWidth":
        model = BorderModel.setTopWidth(v, value);
        break;
      case "rightWidth":
        model = BorderModel.setRightWidth(v, value);
        break;
      case "bottomWidth":
        model = BorderModel.setBottomWidth(v, value);
        break;
      case "leftWidth":
        model = BorderModel.setLeftWidth(v, value);
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
      styles={[
        { id: BorderStyle.NONE, title: t("None") },
        { id: BorderStyle.SOLID, icon: "nc-solid" },
        { id: BorderStyle.DASHED, icon: "nc-dashed" },
        { id: BorderStyle.DOTTED, icon: "nc-dotted" }
      ]}
    />
  );
};

Border.getModel = fromElementModel;

Border.propTypes = {
  className: T.string,
  config: T.shape({
    opacity: T.bool
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
    opacity: true
  }
};

/**
 * @param {{opacity: boolean}} config
 * @param {string} key
 * @return {*}
 */
const conf = (config, key) => getConfig(Border.defaultProps, config, key);
