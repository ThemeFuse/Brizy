import classNames from "classnames";
import React, { useCallback, useMemo } from "react";
import AutoCorrectingInput from "visual/component/Controls/AutoCorrectingInput";
import {
  Props as CSProps,
  ColorPickerSelect
} from "visual/component/Controls/ColorPickerSelect";
import { ColorPickerInputs } from "visual/component/Controls/ColorPicketInputs";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";
import { paletteHex } from "visual/utils/options/ColorPicker/utils";
import { AnimatedGradientRange } from "./AnimatedGradientRange";
import { GradientStop, Type } from "./entities";
import { Props } from "./types";
import { renderColorPickerItems } from "./utils";

export const AnimatedGradient = ({
  onChange,
  value,
  paletteOpenSettings,
  palette = [],
  opacity,
  withNone,
  withAnimatedGradient
}: Omit<Props, "className" | "gradientColors">): JSX.Element => {
  // Initialize gradient stops from start/end if not present
  const gradientStops = useMemo<GradientStop[]>(() => {
    if (value.gradientStops && value.gradientStops.length >= 2) {
      return value.gradientStops.map((stop) => ({
        ...stop,
        hex: paletteHex(stop.palette, palette) ?? stop.hex
      }));
    }

    // Initialize from existing start/end values
    return [
      {
        position: value.start,
        hex: value.hex,
        opacity: value.opacity,
        palette: value.palette
      },
      {
        position: value.end,
        hex: value.gradientHex ?? "",
        opacity: value.gradientOpacity ?? 1,
        palette: value.gradientPalette ?? ""
      }
    ];
  }, [value, palette]);

  const activeStopIndex = value.activeStopIndex ?? 0;

  const activeStop = gradientStops[activeStopIndex] ?? gradientStops[0];

  const trashIconClassName = classNames(
    "brz-ed-control__backgroundColor__animatedGradientTrash",
    {
      "brz-ed-control__backgroundColor__animatedGradientTrash__disabled":
        gradientStops.length <= 2
    }
  );

  const onColorChange: CSProps<Type>["onChange"] = useCallback(
    (v, m) => {
      const updatedStops = [...gradientStops];
      if (updatedStops[activeStopIndex]) {
        updatedStops[activeStopIndex] = {
          ...updatedStops[activeStopIndex],
          hex: v.hex,
          opacity: v.opacity,
          palette: m.isChanged === "palette" ? v.palette : ""
        };
      }

      const activeStop = updatedStops[activeStopIndex];

      onChange(
        {
          type: v.select,
          hex: activeStop.hex,
          palette: activeStop.palette,
          opacity: activeStop.opacity,
          gradientType: value.gradientType,
          start: value.start,
          end: value.end,
          active: value.active,
          degree: value.degree,
          gradientSpeed: value.gradientSpeed,
          gradientStops: updatedStops,
          activeStopIndex
        },
        {
          isChanged: m.isChanged === "select" ? "type" : "gradientStops",
          isChanging: m.isChanging
        }
      );
    },
    [gradientStops, activeStopIndex, value, onChange]
  );

  const handleStopsChange = useCallback(
    (
      stops: GradientStop[],
      activeStopIndex: number | undefined = undefined
    ): void =>
      onChange(
        {
          ...value,
          gradientStops: stops,
          activeStopIndex: activeStopIndex ?? value.activeStopIndex
        },
        { isChanged: "gradientStops" }
      ),
    [value, onChange]
  );

  const handleActiveStopChange = useCallback(
    (index: number): void => {
      const stop = gradientStops[index];
      if (stop) {
        onChange(
          {
            ...value,
            activeStopIndex: index,
            hex: stop.hex,
            opacity: stop.opacity,
            palette: stop.palette
          },
          { isChanged: "activeStopIndex" }
        );
      }
    },
    [gradientStops, value, onChange]
  );

  const handleStopAdd = useCallback(
    (
      position: number,
      color: { hex: string; opacity: number; palette: string }
    ): void => {
      const newStop: GradientStop = {
        position,
        hex: color.hex,
        opacity: color.opacity,
        palette: color.palette
      };
      // Add stop and sort to maintain order (rc-slider expects sorted)
      const updatedStops = [...gradientStops, newStop].sort(
        (a, b) => a.position - b.position
      );
      const newIndex = updatedStops.findIndex(
        (s) =>
          s.position === newStop.position &&
          s.hex === newStop.hex &&
          s.opacity === newStop.opacity
      );

      handleStopsChange(
        updatedStops,
        newIndex >= 0 ? newIndex : updatedStops.length - 1
      );
    },
    [gradientStops, handleStopsChange]
  );

  const handleStopRemove = useCallback((): void => {
    if (gradientStops.length <= 2) {
      return; // Keep at least 2 stops
    }

    const updatedStops = gradientStops.filter((_, i) => i !== activeStopIndex);
    if (!updatedStops.length) {
      return;
    }

    // Select previous stop, or next (which becomes 0) if we removed the first
    let nextActiveIndex = activeStopIndex === 0 ? 0 : activeStopIndex - 1;
    nextActiveIndex = Math.min(nextActiveIndex, updatedStops.length - 1);

    handleStopsChange(updatedStops, nextActiveIndex);
  }, [gradientStops, activeStopIndex, handleStopsChange]);

  const handleHexChange = useCallback(
    (hex: string): void => {
      const updatedStops = [...gradientStops];
      if (updatedStops[activeStopIndex]) {
        updatedStops[activeStopIndex] = {
          ...updatedStops[activeStopIndex],
          hex
        };
      }
      onChange(
        {
          ...value,
          hex,
          gradientStops: updatedStops
        },
        { isChanged: "hex" }
      );
    },
    [gradientStops, activeStopIndex, value, onChange]
  );

  const handleDegreeChange = useCallback(
    (degree: number): void => {
      onChange({ ...value, degree }, { isChanged: "degree" });
    },
    [value, onChange]
  );

  const handleGradientSpeedChange = useCallback(
    (gradientSpeed: number): void => {
      onChange({ ...value, gradientSpeed }, { isChanged: "gradientSpeed" });
    },
    [value, onChange]
  );

  const colorPickerValue = useMemo(
    () => ({
      hex: value.hex,
      palette: value.palette,
      opacity: value.opacity,
      select: value.type
    }),
    [value]
  );

  return (
    <>
      <AnimatedGradientRange
        stops={gradientStops}
        activeStopIndex={activeStopIndex}
        onStopsChange={handleStopsChange}
        onActiveStopChange={handleActiveStopChange}
        onStopAdd={handleStopAdd}
      />
      <ColorPickerSelect<Type>
        palette={palette}
        opacity={opacity}
        value={colorPickerValue}
        onChange={onColorChange}
        paletteOpenSettings={paletteOpenSettings}
      >
        {renderColorPickerItems(withNone, withAnimatedGradient)}
      </ColorPickerSelect>

      <ColorPickerInputs value={activeStop.hex} onChange={handleHexChange}>
        <div className="brz-ed-control__backgroundColor--degree">
          <AutoCorrectingInput
            className="brz-input"
            min={-359}
            max={359}
            step={1}
            value={value.degree}
            onChange={handleDegreeChange}
          />
        </div>
        <div className="brz-ed-control__backgroundColor--speed">
          <span className="brz-ed-control__backgroundColor__animatedGradientLabel">
            {t("Speed")}
          </span>
          <AutoCorrectingInput
            className="brz-input"
            min={0}
            max={10 * gradientStops.length}
            step={1}
            value={value.gradientSpeed}
            onChange={handleGradientSpeedChange}
          />
        </div>
        <EditorIcon
          icon="nc-trash"
          className={trashIconClassName}
          onClick={handleStopRemove}
        />
      </ColorPickerInputs>
    </>
  );
};
