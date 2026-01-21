import React, { ComponentProps, ReactElement, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BackgroundColor as Bg } from "visual/component/Controls/BackgroundColor";
import { PaletteObject } from "visual/component/Controls/ColorPalette/entities/PaletteObject";
import * as O from "visual/component/Options/Type";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { useConfig } from "visual/providers/ConfigProvider";
import { updateUI } from "visual/redux/actions2";
import { currentStyleSelector } from "visual/redux/selectors";
import * as Hex from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
import { Value } from "visual/utils/options/BackgroundColor/entities/Value";
import { Meta } from "visual/utils/options/BackgroundColor/meta";
import * as Model from "visual/utils/options/BackgroundColor/model";
import { toBgControlValue } from "visual/utils/options/BackgroundColor/utils";
import * as Palette from "visual/utils/options/ColorPicker/entities/palette";
import { paletteHex, setOpacity } from "visual/utils/options/ColorPicker/utils";

export type Props = O.Props<Value> &
  O.Meta<Meta> & {
    config?: {
      opacity?: boolean;
      withNone?: boolean;
      isPaletteHidden?: boolean;
      withAnimatedGradient?: boolean;
    };
  };

export const BackgroundColor = ({
  value,
  onChange,
  label,
  config
}: Props): ReactElement => {
  const dispatch = useDispatch();
  const style = useSelector(currentStyleSelector);
  const isPaletteHidden = config?.isPaletteHidden;
  const colorPalette = useMemo(() => {
    if (isPaletteHidden) {
      return undefined;
    }
    return style.colorPalette
      .map((f) => ({ id: `${f.id}`, hex: f.hex }))
      .filter((p): p is PaletteObject => Hex.is(p.hex));
  }, [isPaletteHidden, style]);

  const globalConfig = useConfig();
  const isAnimated = value.type === "animated-gradient";
  const isGradient = value.type === "gradient" || isAnimated;

  const _onChange: ComponentProps<typeof Bg>["onChange"] = (v, m) => {
    const isStart = !(isGradient && value.active === "end");

    const isChanging = !!m.isChanging;

    switch (m.isChanged) {
      case "type": {
        const newValue = Model.setType(v.type, value);

        if (v.type === "animated-gradient" && !newValue.gradientStops?.length) {
          newValue.gradientStops = [
            {
              position: newValue.start,
              hex: newValue.hex,
              opacity: newValue.opacity,
              palette: newValue.palette
            },
            {
              position: newValue.end,
              hex: newValue.gradientHex ?? value.gradientHex,
              opacity: newValue.gradientOpacity ?? value.gradientOpacity,
              palette: newValue.gradientPalette ?? value.gradientPalette
            }
          ];
        }

        onChange(newValue);
        break;
      }
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
        if (isGradient) {
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
      case "gradientSpeed": {
        onChange({ ...value, gradientSpeed: v.gradientSpeed });
        break;
      }
      case "gradientStops": {
        onChange({
          ...value,
          gradientStops: v.gradientStops,
          activeStopIndex: v.activeStopIndex ?? value.activeStopIndex
        });
        break;
      }
      case "activeStopIndex": {
        onChange({ ...value, activeStopIndex: v.activeStopIndex });
        break;
      }
    }
  };
  const openSidebar = () => {
    dispatch(
      updateUI("leftSidebar", {
        drawerContentType: LeftSidebarOptionsIds.globalStyle
      })
    );
  };

  const activeStop = value.activeStopIndex ?? 0;
  const activeGradient = value.gradientStops?.[activeStop];
  const hex = activeGradient && isAnimated ? activeGradient.hex : value.hex;
  const palette =
    activeGradient && isAnimated ? activeGradient.palette : value.palette;

  const _value: Value = {
    ...value,
    palette: Palette.fromString(palette) ?? value.palette,
    hex:
      paletteHex(palette, colorPalette ?? []) ??
      Hex.fromString(hex) ??
      "#000000",
    gradientHex:
      paletteHex(value.gradientPalette, colorPalette ?? []) ?? value.gradientHex
  };

  const enableGlobalStyle = useMemo((): boolean => {
    const { bottomTabsOrder = [], topTabsOrder = [] } =
      globalConfig?.ui?.leftSidebar ?? {};

    return [...bottomTabsOrder, ...topTabsOrder].some(
      (tab) => tab.type === LeftSidebarOptionsIds.globalStyle
    );
  }, [globalConfig?.ui?.leftSidebar]);

  return (
    <>
      {label}
      <Bg
        value={toBgControlValue(_value)}
        onChange={_onChange}
        paletteOpenSettings={enableGlobalStyle ? openSidebar : undefined}
        palette={colorPalette}
        opacity={config?.opacity ?? true}
        withNone={config?.withNone ?? true}
        gradientColors={[_value.hex, _value.gradientHex]}
        withAnimatedGradient={config?.withAnimatedGradient ?? false}
      />
    </>
  );
};
