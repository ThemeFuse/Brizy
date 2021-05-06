import React, { FC, useCallback } from "react";
import classNames from "classnames";
import { getColorPaletteColors } from "visual/utils/color";
import { identity } from "underscore";
import {
  BoxShadow as ShadowControl,
  Props as ShadowProps
} from "visual/component/Controls/BoxShadow";
import {
  DEFAULT_VALUE,
  getTypesItems,
  _setOpacity,
  toElementModel,
  fromElementModel
} from "./utils";
import { useDispatch } from "react-redux";
import { updateUI } from "visual/redux/actions2";
import * as Option from "visual/component/Options/Type";
import { Value } from "./entities/Value";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { Config } from "./entities/Config";
import { OptionType } from "visual/component/Options/Type";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Blur from "visual/utils/cssProps/Blur";
import * as Hex from "visual/utils/color/Hex";
import * as Spread from "visual/utils/cssProps/Spread";
import {
  setBlur,
  setHex,
  setHorizontal,
  setPalette,
  setSpread,
  setType,
  setVertical
} from "visual/component/Options/types/dev/BoxShadow/model";

export interface Props
  extends Option.Props<Value>,
    WithConfig<Config>,
    WithClassName {}

export const BoxShadow: OptionType<Value> & FC<Props> = ({
  onChange,
  value,
  className,
  config
}) => {
  const dispatch = useDispatch();
  const _className = classNames("brz-ed-option__boxShadow", className);
  const onValueChange = useCallback<ShadowProps["onChange"]>(
    (m, meta) => {
      switch (meta.isChanged) {
        case "opacity": {
          const opacity = Opacity.fromNumber(m.opacity);
          opacity !== undefined &&
            onChange(
              toElementModel(
                _setOpacity(opacity, value, !!meta.isChanged),
                identity
              )
            );
          break;
        }
        case "type": {
          onChange(toElementModel(setType(m.type, value), identity));
          break;
        }
        case "blur": {
          const blur = Blur.fromNumber(m.blur);
          blur && onChange(toElementModel(setBlur(blur, value), identity));
          break;
        }
        case "hex": {
          const hex = Hex.fromString(m.hex);
          hex && onChange(toElementModel(setHex(hex, value), identity));
          break;
        }
        case "spread": {
          const spread = Spread.fromNumber(m.spread);
          spread &&
            onChange(toElementModel(setSpread(spread, value), identity));
          break;
        }
        case "palette": {
          onChange(toElementModel(setPalette(m.palette, value), identity));
          break;
        }
        case "horizontal": {
          onChange(
            toElementModel(setHorizontal(m.horizontal, value), identity)
          );
          break;
        }
        case "vertical": {
          onChange(toElementModel(setVertical(m.vertical, value), identity));
          break;
        }
      }
    },
    [onChange, value]
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
    <ShadowControl
      opacity={config?.opacity ?? true}
      className={_className}
      value={value}
      onChange={onValueChange}
      types={getTypesItems()}
      palette={getColorPaletteColors()}
      paletteOpenSettings={openPaletteSidebar}
    />
  );
};

/**
 * @param {(function(key: string): string|number)} get
 * @returns {{}}
 */
BoxShadow.getModel = fromElementModel;

BoxShadow.getElementModel = toElementModel;

BoxShadow.defaultValue = DEFAULT_VALUE;
