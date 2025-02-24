import classNames from "classnames";
import React from "react";
import AutoCorrectingInput from "visual/component/Controls/AutoCorrectingInput";
import { PaletteObject } from "visual/component/Controls/ColorPalette/entities/PaletteObject";
import {
  Props as CSProps,
  ColorPickerSelect
} from "visual/component/Controls/ColorPickerSelect";
import { ColorPickerInputs } from "visual/component/Controls/ColorPicketInputs";
import { Select2 } from "visual/component/Controls/Select2";
import { Item } from "visual/component/Controls/Select2/Item";
import { WithClassName, WithValue } from "visual/types/attributes";
import { t } from "visual/utils/i18n";
import { GradientRange } from "./GradientRange";
import { GradientType, Meta, Type, Value } from "./entities";
import { fromColorMeta } from "./utils";

type Props = WithClassName &
  WithValue<Value> & {
    onChange: (v: Value, m: Meta) => void;
    paletteOpenSettings?: () => void;
    palette?: PaletteObject[];
    opacity: boolean;
    gradientColors: [string, string];
    withNone: boolean;
  };

const renderColorPickerItems = (none: boolean) => {
  const items = [];
  none &&
    items.push(
      <Item<Type> key="none" value={"none"}>
        {t("None")}
      </Item>
    );
  items.push(
    <Item<Type> key="solid" value={"solid"}>
      {t("Solid")}
    </Item>
  );
  items.push(
    <Item<Type> key="gradient" value={"gradient"}>
      {t("Gradient")}
    </Item>
  );
  return items;
};

export const BackgroundColor = ({
  className,
  onChange,
  value,
  paletteOpenSettings,
  palette = [],
  opacity,
  gradientColors: [g1, g2],
  withNone
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
  const onSelectChange = (gradientType: GradientType): void =>
    onChange({ ...value, gradientType }, { isChanged: "gradientType" });
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
        {renderColorPickerItems(withNone)}
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
