import classNames from "classnames";
import React, { FC, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  BoxShadow as ShadowControl,
  Props as ShadowProps
} from "visual/component/Controls/BoxShadow";
import { TypeObject } from "visual/component/Controls/BoxShadow/types";
import * as Option from "visual/component/Options/Type";
import { OptionType } from "visual/component/Options/Type";
import {
  setBlur,
  setHex,
  setHorizontal,
  setPalette,
  setSpread,
  setType,
  setVertical
} from "visual/component/Options/types/dev/BoxShadow/model";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { updateUI } from "visual/redux/actions2";
import { getColorPaletteColors } from "visual/utils/color";
import * as Hex from "visual/utils/color/Hex";
import * as Blur from "visual/utils/cssProps/Blur";
import * as Opacity from "visual/utils/cssProps/opacity";
import { pipe } from "visual/utils/fp";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { Config } from "./entities/Config";
import * as Type from "./entities/Type";
import { Value } from "./entities/Value";
import {
  DEFAULT_VALUE,
  _setOpacity,
  fromElementModel,
  getTypesItems,
  toElementModel
} from "./utils";

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
  const types: TypeObject[] = useMemo(
    pipe(
      () => config?.type,
      Type.read,
      (t): Type.Type[] => (t ? ["none", t] : Type.types),
      getTypesItems
    ),
    [config?.type]
  );
  const onValueChange = useCallback<ShadowProps["onChange"]>(
    (m, meta) => {
      switch (meta.isChanged) {
        case "opacity": {
          const opacity = Opacity.fromNumber(m.opacity);
          opacity !== undefined &&
            onChange(_setOpacity(opacity, value, !!meta.isChanged));
          break;
        }
        case "type": {
          onChange(setType(m.type, value));
          break;
        }
        case "blur": {
          const blur = Blur.fromNumber(m.blur);
          blur && onChange(setBlur(blur, value));
          break;
        }
        case "hex": {
          const hex = Hex.fromString(m.hex);
          hex && onChange(setHex(hex, value));
          break;
        }
        case "spread": {
          onChange(setSpread(m.spread, value));
          break;
        }
        case "palette": {
          onChange(setPalette(m.palette, value));
          break;
        }
        case "horizontal": {
          onChange(setHorizontal(m.horizontal, value));
          break;
        }
        case "vertical": {
          onChange(setVertical(m.vertical, value));
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
          drawerContentType: LeftSidebarOptionsIds.globalStyle
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
      types={types}
      palette={getColorPaletteColors()}
      paletteOpenSettings={openPaletteSidebar}
    />
  );
};

/**
 * @param {(function(key: string): string|number)} get
 * @returns {{}}
 */
BoxShadow.fromElementModel = fromElementModel;

BoxShadow.toElementModel = toElementModel;

BoxShadow.defaultValue = DEFAULT_VALUE;
