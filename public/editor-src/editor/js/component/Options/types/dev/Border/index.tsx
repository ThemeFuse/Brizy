import { identity as id } from "es-toolkit";
import React, { ReactElement, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Border as Control,
  Props as ControlProps
} from "visual/component/Controls/Border";
import { PaletteObject } from "visual/component/Controls/ColorPalette/entities/PaletteObject";
import * as Option from "visual/component/Options/Type";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { useConfig } from "visual/global/hooks";
import { updateUI } from "visual/redux/actions2";
import { currentStyleSelector } from "visual/redux/selectors";
import { WithClassName, WithConfig } from "visual/types/attributes";
import * as Hex from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
import { Config } from "visual/utils/options/Border/entities/Config";
import { Value } from "visual/utils/options/Border/entities/Value";
import * as BorderStyle from "visual/utils/options/Border/entities/style";
import * as Width from "visual/utils/options/Border/entities/width";
import { Meta } from "visual/utils/options/Border/meta";
import * as BorderModel from "visual/utils/options/Border/model";
import { _setOpacity, getStyleObject } from "visual/utils/options/Border/utils";
import { paletteHex } from "visual/utils/options/ColorPicker/utils";

export interface Props
  extends Option.Props<Value>,
    Option.Meta<Meta>,
    WithConfig<Config>,
    WithClassName {}

export const Border = ({
  value,
  onChange,
  className,
  config
}: Props): ReactElement => {
  const dispatch = useDispatch();

  const globalConfig = useConfig();

  const styles = config?.styles ?? BorderStyle.styles;
  const hasNone = styles.includes(BorderStyle.empty);
  const minWidth = useMemo(
    () => (hasNone ? id : (v: number): number => Math.max(1, v)),
    [hasNone]
  );
  const style = useSelector(currentStyleSelector);
  const colorPalette = useMemo((): PaletteObject[] => {
    return style.colorPalette
      .map((f) => ({ id: `${f.id}`, hex: f.hex }))
      .filter((p): p is PaletteObject => Hex.is(p.hex));
  }, [style]);

  const changeStyle = useCallback<ControlProps["onChangeStyle"]>(
    (v) => onChange(BorderModel.setStyle(v, value)),
    [onChange, value]
  );
  const changeHex = useCallback<ControlProps["onChangeHex"]>(
    (v, m) => {
      const _v = Hex.fromString(v);
      _v !== undefined && onChange(BorderModel.setHex(_v, value), m);
    },
    [onChange, value]
  );
  const changeOpacity = useCallback<ControlProps["onChangeOpacity"]>(
    (v, isChanging) => {
      const _v = Opacity.fromNumber(v);
      _v !== undefined &&
        onChange(_setOpacity(_v, value, !isChanging), {
          isChanging
        });
    },
    [onChange, value]
  );
  const changePalette = useCallback<ControlProps["onChangePalette"]>(
    (v) => onChange(BorderModel.setPalette(v, value)),
    [onChange, value]
  );
  const changeWidthType = useCallback<ControlProps["onChangeWidthType"]>(
    (v) => onChange(BorderModel.setWidthType(v, value)),
    [onChange, value]
  );
  const changeWidth = useCallback<ControlProps["onChangeWidth"]>(
    (v) => {
      const _v = Width.fromNumber(minWidth(v));
      _v !== undefined && onChange(BorderModel.setWidth(_v, value));
    },
    [onChange, value, minWidth]
  );
  const changeTopWidth = useCallback<ControlProps["onChangeTopWidth"]>(
    (v) => {
      const _v = Width.fromNumber(minWidth(v));
      _v !== undefined && onChange(BorderModel.setTopWidth(_v, value));
    },
    [onChange, value, minWidth]
  );
  const changeRightWidth = useCallback<ControlProps["onChangeRightWidth"]>(
    (v) => {
      const _v = Width.fromNumber(minWidth(v));
      _v !== undefined && onChange(BorderModel.setRightWidth(_v, value));
    },
    [onChange, value, minWidth]
  );
  const changeBottomWidth = useCallback<ControlProps["onChangeBottomWidth"]>(
    (v) => {
      const _v = Width.fromNumber(minWidth(v));
      _v !== undefined && onChange(BorderModel.setBottomWidth(_v, value));
    },
    [onChange, value, minWidth]
  );
  const changeLeftWidth = useCallback<ControlProps["onChangeLeftWidth"]>(
    (v) => {
      const _v = Width.fromNumber(minWidth(v));
      _v !== undefined && onChange(BorderModel.setLeftWidth(_v, value));
    },
    [onChange, value, minWidth]
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
    const { bottomTabsOrder = [], topTabsOrder = [] } =
      globalConfig?.ui?.leftSidebar ?? {};

    return [...bottomTabsOrder, ...topTabsOrder].some(
      (tab) => tab.type === LeftSidebarOptionsIds.globalStyle
    );
  }, [globalConfig?.ui?.leftSidebar]);

  const hex = paletteHex(value.palette, colorPalette) ?? value.hex;

  const isPaletteHidden = config?.isPaletteHidden;
  const palette = useMemo(
    () => (isPaletteHidden ? undefined : colorPalette),
    [isPaletteHidden, colorPalette]
  );

  return (
    <Control
      className={className}
      paletteList={palette}
      paletteOpenSettings={enableGlobalStyle ? openPaletteSidebar : undefined}
      enableOpacity={config?.opacity ?? true}
      styles={styles.map(getStyleObject).filter(Boolean)}
      widthTypes={config?.width ?? ["grouped", "ungrouped"]}
      style={value.style}
      onChangeStyle={changeStyle}
      hex={hex}
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
