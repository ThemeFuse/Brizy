import React, { FC, useCallback, useMemo } from "react";
import { identity as id } from "underscore";
import * as BorderStyle from "./entities/style";
import * as BorderModel from "./model";
import {
  DEFAULT_VALUE,
  fromElementModel,
  toElementModel,
  getStyleObject
} from "./utils";
import {
  Border as Control,
  Props as ControlProps
} from "visual/component/Controls/Border";
import { getColorPaletteColors } from "visual/utils/color";
import { updateUI } from "visual/redux/actions2";
import { useDispatch } from "react-redux";
import { Value } from "./entities/Value";
import { Config } from "./entities/Config";
import * as Option from "visual/component/Options/Type";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { OptionType } from "visual/component/Options/Type";
import { _setOpacity } from "./utils";
import { mPipe } from "visual/utils/fp";
import * as Width from "./entities/width";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Hex from "visual/utils/color/Hex";

export interface Props
  extends Option.Props<Value>,
    WithConfig<Config>,
    WithClassName {}

export const Border: OptionType<Value> & FC<Props> = ({
  value,
  onChange,
  className,
  config
}) => {
  const dispatch = useDispatch();
  const styles = config?.styles ?? BorderStyle.styles;
  const hasNone = styles.includes(BorderStyle.empty);
  const minWidth = useMemo(
    () => (hasNone ? id : (v: number): number => Math.max(1, v)),
    [hasNone, id]
  );
  const change = useCallback(
    mPipe((v: Value) => toElementModel(v, k => k), onChange),
    [onChange]
  );

  const changeStyle = useCallback<ControlProps["onChangeStyle"]>(
    v => change(BorderModel.setStyle(v, value)),
    [change, value]
  );
  const changeHex = useCallback<ControlProps["onChangeHex"]>(
    v => {
      const _v = Hex.fromString(v);
      _v !== undefined && change(BorderModel.setHex(_v, value));
    },
    [change, value]
  );
  const changeOpacity = useCallback<ControlProps["onChangeOpacity"]>(
    (v, f) => {
      const _v = Opacity.fromNumber(v);
      _v !== undefined && change(_setOpacity(_v, value, f));
    },
    [change, value]
  );
  const changePalette = useCallback<ControlProps["onChangePalette"]>(
    v => change(BorderModel.setPalette(v, value)),
    [change, value]
  );
  const changeWidthType = useCallback(
    v => change(BorderModel.setWidthType(v, value)),
    [change, value]
  );
  const changeWidth = useCallback<ControlProps["onChangeWidth"]>(
    v => {
      const _v = Width.fromNumber(minWidth(v));
      _v !== undefined && change(BorderModel.setWidth(_v, value));
    },
    [change, value]
  );
  const changeTopWidth = useCallback(
    v => {
      const _v = Width.fromNumber(minWidth(v));
      _v !== undefined && change(BorderModel.setTopWidth(_v, value));
    },
    [change, value]
  );
  const changeRightWidth = useCallback(
    v => {
      const _v = Width.fromNumber(minWidth(v));
      _v !== undefined && change(BorderModel.setRightWidth(_v, value));
    },
    [change, value]
  );
  const changeBottomWidth = useCallback(
    v => {
      const _v = Width.fromNumber(minWidth(v));
      _v !== undefined && change(BorderModel.setBottomWidth(_v, value));
    },
    [change, value]
  );
  const changeLeftWidth = useCallback(
    v => {
      const _v = Width.fromNumber(minWidth(v));
      _v !== undefined && change(BorderModel.setLeftWidth(_v, value));
    },
    [change, value]
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
Border.getElementModel = toElementModel;
Border.defaultValue = DEFAULT_VALUE;
