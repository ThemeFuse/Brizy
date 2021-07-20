import React, { ComponentProps, FC, useCallback } from "react";
import _ from "underscore";
import { getColorPaletteColors as paletteColors } from "visual/utils/color";
import * as O from "visual/component/Options/Type";
import { BackgroundColor as Bg } from "visual/component/Controls/BackgroundColor";
import { Value } from "./entities/Value";
import {
  DEFAULT_VALUE,
  fromElementModel,
  toBgControlValue,
  toElementModel
} from "./utils";
import { getStore } from "visual/redux/store";
import { updateUI } from "visual/redux/actions2";
import * as Model from "./model";
import {
  paletteHex,
  setOpacity
} from "visual/component/Options/types/dev/ColorPicker/utils";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Hex from "visual/utils/color/Hex";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";

export type Props = O.Props<Value> & {
  config: {
    opacity: boolean;
  };
};

const openSidebar = (): void => {
  getStore().dispatch(
    updateUI("leftSidebar", {
      isOpen: true,
      drawerContentType: "styling"
    })
  );
};

export const BackgroundColor: FC<Props> & O.OptionType<Value> = ({
  value,
  onChange,
  config
}) => {
  const _onChange = useCallback<ComponentProps<typeof Bg>["onChange"]>(
    (v, m) => {
      const isStart = !(value.type === "gradient" && value.active === "end");
      switch (m.isChanged) {
        case "type":
          onChange(toElementModel(Model.setType(v.type, value), _.identity));
          break;
        case "gradientType":
          onChange(
            toElementModel(
              Model.setGradientType(v.gradientType, value),
              _.identity
            )
          );
          break;
        case "start":
          onChange(toElementModel(Model.setStart(v.start, value), _.identity));
          break;
        case "end":
          onChange(toElementModel(Model.setEnd(v.end, value), _.identity));
          break;
        case "active":
          onChange(
            toElementModel(Model.setActive(v.active, value), _.identity)
          );
          break;
        case "degree": {
          if (value.type === "gradient") {
            const setter =
              value.gradientType === "radial"
                ? Model.setRadialDegree
                : Model.setLinearDegree;
            onChange(toElementModel(setter(v.degree, value), _.identity));
          }
          break;
        }
        case "hex": {
          const setter = isStart ? Model.setHex : Model.setGradientHex;
          const hex = Hex.fromString(v.hex);
          hex !== undefined &&
            onChange(toElementModel(setter(hex, value), _.identity));
          break;
        }
        case "opacity": {
          const setter = isStart ? Model.setOpacity : Model.setGradientOpacity;
          const opacity = Opacity.fromNumber(v.opacity);
          opacity !== undefined &&
            onChange(
              toElementModel(
                setOpacity(setter, opacity, value, !!m.opacityDragEnd),
                _.identity
              )
            );
          break;
        }
        case "palette": {
          const setter = isStart ? Model.setPalette : Model.setGradientPalette;
          const palette = Palette.fromString(v.palette);
          palette !== undefined &&
            onChange(toElementModel(setter(palette, value), _.identity));
          break;
        }
      }
    },
    [value]
  );
  const palette = paletteColors();
  const _value: Value = {
    ...value,
    hex: paletteHex(value.palette, palette) ?? value.hex,
    gradientHex: paletteHex(value.gradientPalette, palette) ?? value.gradientHex
  };
  return (
    <Bg
      value={toBgControlValue(_value)}
      onChange={_onChange}
      paletteOpenSettings={openSidebar}
      palette={paletteColors()}
      opacity={config?.opacity ?? true}
      gradientColors={[_value.hex, _value.gradientHex]}
    />
  );
};

BackgroundColor.getModel = fromElementModel;

BackgroundColor.getElementModel = toElementModel;

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
BackgroundColor.defaultValue = DEFAULT_VALUE;
