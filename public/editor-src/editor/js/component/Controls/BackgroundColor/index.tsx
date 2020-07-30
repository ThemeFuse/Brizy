import React, { FC, useCallback } from "react";
import classNames from "classnames";
import { t } from "visual/utils/i18n";
import { WithClassName, WithValue } from "visual/utils/options/attributes";
import AutoCorrectingInput from "visual/component/Controls/AutoCorrectingInput";
import {
  ColorPickerSelect,
  Props as CSProps
} from "visual/component/Controls/ColorPickerSelect";
import { Item } from "visual/component/Controls/MultiSelect/Item";
import { PaletteObject } from "visual/component/Controls/ColorPalette/entities/PaletteObject";
import { Value, Meta, Type, GradientType } from "./entities";
import { fromColorMeta } from "./utils";
import { ColorPickerInputs } from "visual/component/Controls/ColorPicketInputs";
import { Select2 } from "visual/component/Controls/Select2";
import { GradientRange } from "./GradientRange";

type Props = WithClassName &
  WithValue<Value> & {
    onChange: (v: Value, m: Meta) => void;
    paletteOpenSettings: () => void;
    palette: PaletteObject[];
    opacity: boolean;
    gradientColors: [string, string];
  };

export const BackgroundColor: FC<Props> = ({
  className,
  onChange,
  value,
  paletteOpenSettings,
  palette,
  opacity,
  gradientColors: [g1, g2]
}) => {
  const onColorChange: CSProps<Type>["onChange"] = useCallback(
    (v, m) => {
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
    },
    [onChange]
  );
  const onSelectChange = useCallback(
    (gradientType: GradientType): void =>
      onChange({ ...value, gradientType }, { isChanged: "gradientType" }),
    [onChange, value]
  );
  const _className = classNames("brz-ed-control__backgroundColor", className);
  return (
    <div className={_className}>
      {value.type === "gradient" ? (
        <GradientRange
          start={value.start}
          end={value.end}
          active={value.active}
          hex1={g1}
          hex2={g2}
          onStartChange={(start): void =>
            onChange({ ...value, start }, { isChanged: "start" })
          }
          onEndChange={(end): void =>
            onChange({ ...value, end }, { isChanged: "end" })
          }
          onActiveChange={(active): void =>
            onChange({ ...value, active }, { isChanged: "active" })
          }
        />
      ) : null}
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
        <Item<Type> value={"none"}>{t("None")}</Item>
        <Item<Type> value={"solid"}>{t("Solid")}</Item>
        <Item<Type> value={"gradient"}>{t("Gradient")}</Item>
      </ColorPickerSelect>
      <ColorPickerInputs
        value={value.hex}
        onChange={(hex): void =>
          onChange({ ...value, hex }, { isChanged: "hex" })
        }
      >
        {value.type === "gradient" ? (
          <>
            <Select2<GradientType>
              editable={false}
              search={(s: string, v: GradientType): boolean => v.includes(s)}
              className={classNames(
                "brz-ed-control__backgroundColor__gradientType",
                `brz-ed-control__backgroundColor__gradientType--${value.gradientType}`
              )}
              onChange={onSelectChange}
              value={value.gradientType}
            >
              <Item<GradientType> value={"linear"}>{t("Linear")}</Item>
              <Item<GradientType> value={"radial"}>{t("Radial")}</Item>
            </Select2>
            <div className="brz-ed-control__backgroundColor--degree">
              <AutoCorrectingInput
                className="brz-input"
                min={-359}
                max={359}
                step={1}
                value={value.degree}
                onChange={(degree: number): void =>
                  onChange({ ...value, degree }, { isChanged: "degree" })
                }
              />
            </div>
          </>
        ) : null}
      </ColorPickerInputs>
    </div>
  );
};
