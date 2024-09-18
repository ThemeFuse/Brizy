import React, { ReactElement, useCallback, useMemo } from "react";
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
import { WithClassName, WithConfig } from "visual/types/attributes";
import { getColorPaletteColors } from "visual/utils/color";
import * as Hex from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
import { Config } from "visual/utils/options/Border/entities/Config";
import * as BorderStyle from "visual/utils/options/Border/entities/style";
import { Value } from "visual/utils/options/Border/entities/Value";
import * as Width from "visual/utils/options/Border/entities/width";
import { Meta } from "visual/utils/options/Border/meta";
import * as BorderModel from "visual/utils/options/Border/model";
import { getStyleObject, _setOpacity } from "visual/utils/options/Border/utils";
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
  const styles = config?.styles ?? BorderStyle.styles;
  const hasNone = styles.includes(BorderStyle.empty);
  const minWidth = useMemo(
    () => (hasNone ? id : (v: number): number => Math.max(1, v)),
    [hasNone]
  );

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
    const config = GlobalConfig.getAll();
    const { bottomTabsOrder = [], topTabsOrder = [] } =
      config.ui?.leftSidebar ?? {};

    return [...bottomTabsOrder, ...topTabsOrder].includes(
      LeftSidebarOptionsIds.globalStyle
    );
  }, []);

  const palette = getColorPaletteColors();
  const hex = paletteHex(value.palette, palette) ?? value.hex;

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
