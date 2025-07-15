import classNames from "classnames";
import React, { ReactElement, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PaletteObject } from "visual/component/Controls/ColorPalette/entities/PaletteObject";
import {
  ColorPicker3,
  Props as ColorPicker3Props
} from "visual/component/Controls/ColorPicker3";
import {
  ColorPickerInputs,
  Props as ColorPickerInputsProps
} from "visual/component/Controls/ColorPicketInputs";
import * as Option from "visual/component/Options/Type";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { useConfig } from "visual/providers/ConfigProvider";
import { updateUI } from "visual/redux/actions2";
import { currentStyleSelector } from "visual/redux/selectors";
import { WithClassName, WithConfig } from "visual/types/attributes";
import * as Hex from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
import { mPipe } from "visual/utils/fp";
import { Value } from "visual/utils/options/ColorPicker/entities/Value";
import * as Palette from "visual/utils/options/ColorPicker/entities/palette";
import {
  setOpacity as _setOpacity,
  setHex,
  setPalette
} from "visual/utils/options/ColorPicker/model";
import * as Utils from "visual/utils/options/ColorPicker/utils";

const setOpacity = Utils.setOpacity.bind(null, _setOpacity);

export interface Config {
  opacity?: boolean;
  isPaletteHidden?: boolean;
}

export interface Props
  extends Option.Props<Value>,
    WithConfig<Config>,
    WithClassName {
  attr?: Record<string, string>;
}

export const ColorPicker = ({
  className: _className,
  attr,
  onChange,
  value,
  config
}: Props): ReactElement => {
  const dispatch = useDispatch();
  const style = useSelector(currentStyleSelector);
  const colorPalette = useMemo((): PaletteObject[] => {
    return style.colorPalette
      .map((f) => ({ id: `${f.id}`, hex: f.hex }))
      .filter((p): p is PaletteObject => Hex.is(p.hex));
  }, [style]);

  const globalConfig = useConfig();

  const className = classNames(
    "brz-ed-option__colorPicker",
    _className,
    attr?.className
  );
  const openLeftSidebar = useCallback(
    () =>
      dispatch(
        updateUI("leftSidebar", {
          drawerContentType: LeftSidebarOptionsIds.globalStyle
        })
      ),
    [dispatch]
  );
  const _onChange = useCallback<ColorPicker3Props["onChange"]>(
    (v, meta) => {
      const isChanging = !!meta?.isChanging;

      switch (meta.isChanged) {
        case "palette":
          mPipe(
            () => v.palette,
            Palette.fromString,
            (v) => setPalette(v, value),
            onChange
          )();
          break;
        case "hex":
          mPipe(
            () => v.hex,
            Hex.fromString,
            (v) => setHex(v, value),
            (v) => onChange(v, { isChanging })
          )();
          break;
        case "opacity":
          mPipe(
            () => v.opacity,
            Opacity.fromNumber,
            (v) => setOpacity(v, value, !isChanging),
            (v) => onChange(v, { isChanging })
          )();
          break;
      }
    },
    [value, onChange]
  );

  const onHexChange = useCallback<ColorPickerInputsProps["onChange"]>(
    (hex) => onChange(setHex(hex, value)),
    [value, onChange]
  );

  const enableGlobalStyle = useMemo((): boolean => {
    const { bottomTabsOrder = [], topTabsOrder = [] } =
      globalConfig?.ui?.leftSidebar ?? {};

    return [...bottomTabsOrder, ...topTabsOrder].some(
      (tab) => tab.type === LeftSidebarOptionsIds.globalStyle
    );
  }, [globalConfig?.ui?.leftSidebar]);

  const isPaletteHidden = config?.isPaletteHidden;
  const palette = useMemo(
    () => (isPaletteHidden ? undefined : colorPalette),
    [isPaletteHidden, colorPalette]
  );

  return (
    <div {...attr} className={className}>
      <ColorPicker3
        value={value}
        opacity={config?.opacity ?? true}
        onChange={_onChange}
        palette={palette}
        paletteOpenSettings={enableGlobalStyle ? openLeftSidebar : undefined}
      />
      <ColorPickerInputs value={value.hex} onChange={onHexChange} />
    </div>
  );
};
