import classNames from "classnames";
import React, { ReactElement, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  ColorPicker3,
  Props as ColorPicker3Props
} from "visual/component/Controls/ColorPicker3";
import {
  ColorPickerInputs,
  Props as ColorPickerInputsProps
} from "visual/component/Controls/ColorPicketInputs";
import * as Option from "visual/component/Options/Type";
import GlobalConfig from "visual/global/Config";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { updateUI } from "visual/redux/actions2";
import { WithClassName, WithConfig } from "visual/types/attributes";
import { getColorPaletteColors as paletteColors } from "visual/utils/color";
import * as Hex from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
import { mPipe } from "visual/utils/fp";
import * as Palette from "visual/utils/options/ColorPicker/entities/palette";
import { Value } from "visual/utils/options/ColorPicker/entities/Value";
import {
  setHex,
  setOpacity as _setOpacity,
  setPalette
} from "visual/utils/options/ColorPicker/model";
import * as Utils from "visual/utils/options/ColorPicker/utils";

const setOpacity = Utils.setOpacity.bind(null, _setOpacity);

export interface Config {
  opacity: boolean;
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
  const className = classNames(
    "brz-ed-option__colorPicker",
    _className,
    attr?.className
  );
  const openLeftSidebar = useCallback(
    () =>
      dispatch(
        updateUI("leftSidebar", {
          isOpen: true,
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
    const config = GlobalConfig.getAll();
    const { bottomTabsOrder = [], topTabsOrder = [] } =
      config.ui?.leftSidebar ?? {};

    return [...bottomTabsOrder, ...topTabsOrder].includes(
      LeftSidebarOptionsIds.globalStyle
    );
  }, []);

  const isPaletteHidden = config?.isPaletteHidden;
  const palette = useMemo(
    () => (isPaletteHidden ? undefined : paletteColors()),
    [isPaletteHidden]
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
