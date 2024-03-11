import React, { ComponentProps, FC, useMemo } from "react";
import { BackgroundColor as Bg } from "visual/component/Controls/BackgroundColor";
import * as O from "visual/component/Options/Type";
import {
  paletteHex,
  setOpacity
} from "visual/component/Options/types/dev/ColorPicker/utils";
import Config from "visual/global/Config";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { updateUI } from "visual/redux/actions2";
import { getStore } from "visual/redux/store";
import { getColorPaletteColors as paletteColors } from "visual/utils/color";
import * as Hex from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
import { Value } from "visual/utils/options/BackgroundColor/entities/Value";
import { Meta } from "visual/utils/options/BackgroundColor/meta";
import * as Palette from "visual/utils/options/ColorPicker/entities/palette";
import * as Model from "./model";
import { toBgControlValue } from "./utils";

export type Props = O.Props<Value> &
  O.Meta<Meta> & {
    config?: {
      opacity?: boolean;
      withNone?: boolean;
    };
  };

const openSidebar = (): void => {
  getStore().dispatch(
    updateUI("leftSidebar", {
      isOpen: true,
      drawerContentType: LeftSidebarOptionsIds.globalStyle
    })
  );
};

export const BackgroundColor: FC<Props> = ({ value, onChange, config }) => {
  const _onChange: ComponentProps<typeof Bg>["onChange"] = (v, m) => {
    const isStart = !(value.type === "gradient" && value.active === "end");

    const isChanging = !!m.isChanging;

    switch (m.isChanged) {
      case "type":
        onChange(Model.setType(v.type, value));
        break;
      case "gradientType":
        onChange(Model.setGradientType(v.gradientType, value));
        break;
      case "start":
        onChange(Model.setStart(v.start, value));
        break;
      case "end":
        onChange(Model.setEnd(v.end, value));
        break;
      case "active":
        onChange(Model.setActive(v.active, value));
        break;
      case "degree": {
        if (value.type === "gradient") {
          const setter =
            value.gradientType === "radial"
              ? Model.setRadialDegree
              : Model.setLinearDegree;
          onChange(setter(v.degree, value));
        }
        break;
      }
      case "hex": {
        const setter = isStart ? Model.setHex : Model.setGradientHex;
        const hex = Hex.fromString(v.hex);
        hex !== undefined && onChange(setter(hex, value), { isChanging });
        break;
      }
      case "opacity": {
        const setter = isStart ? Model.setOpacity : Model.setGradientOpacity;
        const opacity = Opacity.fromNumber(v.opacity);
        opacity !== undefined &&
          onChange(setOpacity(setter, opacity, value, isChanging), {
            isChanging
          });
        break;
      }
      case "palette": {
        const setter = isStart ? Model.setPalette : Model.setGradientPalette;
        const palette = Palette.fromString(v.palette);
        palette !== undefined && onChange(setter(palette, value));
        break;
      }
    }
  };
  const palette = paletteColors();
  const _value: Value = {
    ...value,
    hex: paletteHex(value.palette, palette) ?? value.hex,
    gradientHex: paletteHex(value.gradientPalette, palette) ?? value.gradientHex
  };

  const enableGlobalStyle = useMemo((): boolean => {
    const config = Config.getAll();
    const { bottomTabsOrder = [], topTabsOrder = [] } =
      config.ui?.leftSidebar ?? {};

    return [...bottomTabsOrder, ...topTabsOrder].includes(
      LeftSidebarOptionsIds.globalStyle
    );
  }, []);

  return (
    <Bg
      value={toBgControlValue(_value)}
      onChange={_onChange}
      paletteOpenSettings={enableGlobalStyle ? openSidebar : undefined}
      palette={paletteColors()}
      opacity={config?.opacity ?? true}
      withNone={config?.withNone ?? true}
      gradientColors={[_value.hex, _value.gradientHex]}
    />
  );
};
