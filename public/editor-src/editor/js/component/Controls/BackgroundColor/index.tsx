import classNames from "classnames";
import React from "react";
import {
  Props as CSProps,
  ColorPickerSelect
} from "visual/component/Controls/ColorPickerSelect";
import { ColorPickerInputs } from "visual/component/Controls/ColorPicketInputs";
import { AnimatedGradient } from "./AnimatedGradient";
import { Gradient } from "./Gradient";
import { Type } from "./entities";
import { Props } from "./types";
import { fromColorMeta, renderColorPickerItems } from "./utils";

export const BackgroundColor = ({
  className,
  onChange,
  value,
  paletteOpenSettings,
  palette = [],
  opacity,
  gradientColors: [g1, g2],
  withNone,
  withAnimatedGradient
}: Props): JSX.Element => {
  const onColorChange: CSProps<Type>["onChange"] = (v, m) => {
    onChange(
      {
        type: v.select,
        hex: v.hex,
        opacity: v.opacity,
        palette: v.palette,
        gradientType: value.gradientType,
        start: value.start,
        end: value.end,
        active: value.active,
        degree: value.degree
      },
      fromColorMeta(m)
    );
  };

  const isAnimated = value.type === "animated-gradient";
  const isGradient = value.type === "gradient";

  const _className = classNames(
    "brz-ed-control__backgroundColor",
    {
      "brz-ed-control__backgroundColor--animatedGradient": isAnimated
    },
    className
  );

  return (
    <div className={_className}>
      {isAnimated ? (
        <AnimatedGradient
          value={value}
          onChange={onChange}
          palette={palette}
          opacity={opacity}
          withNone={withNone}
          withAnimatedGradient={withAnimatedGradient}
        />
      ) : isGradient ? (
        <Gradient
          value={value}
          onChange={onChange}
          palette={palette}
          opacity={opacity}
          gradientColors={[g1, g2]}
          withNone={withNone}
          withAnimatedGradient={withAnimatedGradient}
        />
      ) : (
        <>
          <ColorPickerSelect<Type>
            palette={palette}
            opacity={opacity}
            value={{
              hex: value.hex,
              palette: value.palette,
              opacity: value.opacity,
              select: value.type
            }}
            onChange={onColorChange}
            paletteOpenSettings={paletteOpenSettings}
          >
            {renderColorPickerItems(withNone, withAnimatedGradient)}
          </ColorPickerSelect>
          <ColorPickerInputs
            value={value.hex}
            onChange={(hex): void =>
              onChange({ ...value, hex }, { isChanged: "hex" })
            }
          />
        </>
      )}
    </div>
  );
};
