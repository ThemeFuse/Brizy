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
import { getColorPaletteColors } from "visual/utils/color";
import * as ColorUtils from "visual/component/Options/types/dev/ColorPicker/utils";
import { mCompose } from "visual/utils/value";

const _setOpacity = ColorUtils.setOpacity.bind(
  undefined,
  BorderModel.setOpacity
);

export const Border = ({ value, onChange, className, config }) => {
  const styles = config.styles ?? BorderStyle.styles;
  const hasNone = styles.includes(BorderStyle.empty);
  const minWidth = hasNone ? id : v => Math.max(1, v);
  const change = mCompose(onChange, toElementModel);

  const changeStyle = v => change(BorderModel.setStyle(v, value));
  const changeHex = v => change(BorderModel.setHex(v, value));
  const changeOpacity = (v, f) => change(_setOpacity(v, value, f));
  const changePalette = v => change(BorderModel.setPalette(v, value));
  const changeWidthType = v => change(BorderModel.setWidthType(v, value));
  const changeWidth = v => change(BorderModel.setWidth(minWidth(v), value));
  const changeTopWidth = v =>
    change(BorderModel.setTopWidth(minWidth(v), value));
  const changeRightWidth = v =>
    change(BorderModel.setRightWidth(minWidth(v), value));
  const changeBottomWidth = v =>
    change(BorderModel.setBottomWidth(minWidth(v), value));
  const changeLeftWidth = v =>
    change(BorderModel.setLeftWidth(minWidth(v), value));

  return (
    <Control
      className={className}
      paletteList={getColorPaletteColors()}
      paletteOpenSettings={openPaletteSidebar}
      enableOpacity={config?.opacity ?? true}
      styles={styles.map(getStyleObject).filter(Boolean)}
      widthTypes={config?.width ?? ["grouped", "ungrouped"]}
      style={value.style}
      onChangeStyle={changeStyle}
      hex={value.hex}
      onChangeHex={changeHex}
      opacity={value.opacity}
      onChangeOpacity={changeOpacity}
      palette={value.palette}
      onChangePalette={changePalette}
      widthType={value.widthType}
      onChangeWidthType={changeWidthType}
      width={value.width}
      onChangeWidth={changeWidth}
      topWidth={value.topWidth}
      onChangeTopWidth={changeTopWidth}
      rightWidth={value.rightWidth}
      onChangeRightWidth={changeRightWidth}
      bottomWidth={value.bottomWidth}
      onChangeBottomWidth={changeBottomWidth}
      leftWidth={value.leftWidth}
      onChangeLeftWidth={changeLeftWidth}
    />
  );
};

Border.getModel = fromElementModel;

Border.propTypes = {
  className: T.string,
  config: T.shape({
    opacity: T.bool,
    styles: T.arrayOf(T.oneOf(BorderStyle.styles)),
    width: T.arrayOf(T.oneOf(["grouped", "ungrouped"]))
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
  config: {}
};
