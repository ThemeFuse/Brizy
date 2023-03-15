import classNames from "classnames";
import React, { FC, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  ColorPicker3,
  Props as ColorPicker3Props
} from "visual/component/Controls/ColorPicker3";
import { ColorPickerInputs } from "visual/component/Controls/ColorPicketInputs";
import * as Option from "visual/component/Options/Type";
import GlobalConfig from "visual/global/Config";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { updateUI } from "visual/redux/actions2";
import { getColorPaletteColors as paletteColors } from "visual/utils/color";
import * as Hex from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
import { mPipe } from "visual/utils/fp";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { Value } from "./entities/Value";
import * as Palette from "./entities/palette";
import { setOpacity as _setOpacity, setHex, setPalette } from "./model";
import * as Utils from "./utils";

const setOpacity = Utils.setOpacity.bind(null, _setOpacity);

export interface Config {
  opacity: boolean;
}

export interface Props
  extends Option.Props<Value>,
    WithConfig<Config>,
    WithClassName {
  attr?: Record<string, string>;
}

export const ColorPicker: FC<Props> = ({
  className: _className,
  attr,
  onChange,
  value,
  config
}) => {
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
            onChange
          )();
          break;
        case "opacity":
          mPipe(
            () => v.opacity,
            Opacity.fromNumber,
            (v) => setOpacity(v, value, !!meta.opacityDragEnd),
            onChange
          )();
          break;
      }
    },
    [value, onChange]
  );

  const onHexChange = useCallback(
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

  return (
    <div {...attr} className={className}>
      <ColorPicker3
        value={value}
        opacity={config?.opacity ?? true}
        onChange={_onChange}
        palette={paletteColors()}
        paletteOpenSettings={enableGlobalStyle ? openLeftSidebar : undefined}
      />
      <ColorPickerInputs value={value.hex} onChange={onHexChange} />
    </div>
  );
};
