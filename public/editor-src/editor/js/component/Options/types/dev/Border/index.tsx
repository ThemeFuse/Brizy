import React, { FC, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { identity as id } from "underscore";
import {
  Border as Control,
  Props as ControlProps
} from "visual/component/Controls/Border";
import * as Option from "visual/component/Options/Type";
import GlobalConfig from "visual/global/Config";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { updateUI } from "visual/redux/actions2";
import { getColorPaletteColors } from "visual/utils/color";
import * as Hex from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { Config } from "./entities/Config";
import { Value } from "./entities/Value";
import * as BorderStyle from "./entities/style";
import * as Width from "./entities/width";
import * as BorderModel from "./model";
import { getStyleObject } from "./utils";
import { _setOpacity } from "./utils";

export interface Props
  extends Option.Props<Value>,
    WithConfig<Config>,
    WithClassName {}

export const Border: FC<Props> = ({ value, onChange, className, config }) => {
  const dispatch = useDispatch();
  const styles = config?.styles ?? BorderStyle.styles;
  const hasNone = styles.includes(BorderStyle.empty);
  const minWidth = useMemo(
    () => (hasNone ? id : (v: number): number => Math.max(1, v)),
    [hasNone, id]
  );

  const changeStyle = useCallback<ControlProps["onChangeStyle"]>(
    (v) => onChange(BorderModel.setStyle(v, value)),
    [onChange, value]
  );
  const changeHex = useCallback<ControlProps["onChangeHex"]>(
    (v) => {
      const _v = Hex.fromString(v);
      _v !== undefined && onChange(BorderModel.setHex(_v, value));
    },
    [onChange, value]
  );
  const changeOpacity = useCallback<ControlProps["onChangeOpacity"]>(
    (v, f) => {
      const _v = Opacity.fromNumber(v);
      _v !== undefined && onChange(_setOpacity(_v, value, f));
    },
    [onChange, value]
  );
  const changePalette = useCallback<ControlProps["onChangePalette"]>(
    (v) => onChange(BorderModel.setPalette(v, value)),
    [onChange, value]
  );
  const changeWidthType = useCallback(
    (v) => onChange(BorderModel.setWidthType(v, value)),
    [onChange, value]
  );
  const changeWidth = useCallback<ControlProps["onChangeWidth"]>(
    (v) => {
      const _v = Width.fromNumber(minWidth(v));
      _v !== undefined && onChange(BorderModel.setWidth(_v, value));
    },
    [onChange, value]
  );
  const changeTopWidth = useCallback(
    (v) => {
      const _v = Width.fromNumber(minWidth(v));
      _v !== undefined && onChange(BorderModel.setTopWidth(_v, value));
    },
    [onChange, value]
  );
  const changeRightWidth = useCallback(
    (v) => {
      const _v = Width.fromNumber(minWidth(v));
      _v !== undefined && onChange(BorderModel.setRightWidth(_v, value));
    },
    [onChange, value]
  );
  const changeBottomWidth = useCallback(
    (v) => {
      const _v = Width.fromNumber(minWidth(v));
      _v !== undefined && onChange(BorderModel.setBottomWidth(_v, value));
    },
    [onChange, value]
  );
  const changeLeftWidth = useCallback(
    (v) => {
      const _v = Width.fromNumber(minWidth(v));
      _v !== undefined && onChange(BorderModel.setLeftWidth(_v, value));
    },
    [onChange, value]
  );
  const openPaletteSidebar = useCallback(
    () =>
      dispatch(
        updateUI("leftSidebar", {
          isOpen: true,
          drawerContentType: LeftSidebarOptionsIds.globalStyle
        })
      ),
    [dispatch]
  );

  const enableGlobalStyle = useMemo((): boolean => {
    const config = GlobalConfig.getAll();
    const { bottomTabsOrder = [], topTabsOrder = [] } =
      config.ui?.leftSidebar ?? {};

    return [...bottomTabsOrder, ...topTabsOrder].includes(
      LeftSidebarOptionsIds.globalStyle
    );
  }, []);

  return (
    <Control
      className={className}
      paletteList={getColorPaletteColors()}
      paletteOpenSettings={enableGlobalStyle ? openPaletteSidebar : undefined}
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
