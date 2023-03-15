import { mPipe } from "fp-utilities";
import React, { JSXElementConstructor, useCallback, useMemo } from "react";
import { NumberSlider } from "visual/component/Controls/NumberSlider";
import { OptionLabel } from "visual/component/OptionLabel";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { OnChange } from "visual/component/Options/Type";
import { useDebouncedOnChange } from "visual/component/hooks";
import { t } from "visual/utils/i18n";
import { EffectProps } from "../types/EffectProps";
import {
  Direction as ScaleDirection,
  Scale as V,
  XPosition,
  YPosition
} from "../types/Scale";
import * as Speed from "../types/utils/Speed";
import { Direction, Props } from "./Direction";
import { Viewport } from "./Viewport";

const directionTitle: { [k in ScaleDirection]: string } = {
  up: t("Up"),
  down: t("Down"),
  downUp: t("Down Up"),
  upDown: t("Up Down")
};

const xPositionTitle: { [k in XPosition]: string } = {
  left: t("Left"),
  center: t("Center"),
  right: t("Right")
};

const yPositionTitle: { [k in YPosition]: string } = {
  top: t("Top"),
  center: t("Center"),
  bottom: t("Bottom")
};

export const Scale: JSXElementConstructor<EffectProps<V>> = ({
  value,
  onChange
}) => {
  const onDirectionChange = useCallback<OnChange<V["direction"]>>(
    (direction) => onChange({ ...value, direction }),
    [value, onChange]
  );
  const onXChange = useCallback<OnChange<V["x"]>>(
    (x) => onChange({ ...value, x }),
    [value, onChange]
  );
  const onYChange = useCallback<OnChange<V["y"]>>(
    (y) => onChange({ ...value, y }),
    [value, onChange]
  );

  const onSpeedChange = useCallback(
    mPipe(Speed.fromNumber, (speed) => onChange({ ...value, speed })),
    [value, onChange]
  );

  const [speed, handleSpeedChange] = useDebouncedOnChange<number>(
    value.speed,
    onSpeedChange,
    500
  );

  const onViewportChange = useCallback<OnChange<V["viewport"]>>(
    (viewport) => onChange({ ...value, viewport }),
    [value, onChange]
  );
  const directions = useMemo<Props<V["direction"]>["directions"]>(
    () => Object.entries(directionTitle) as [ScaleDirection, string][],
    []
  );
  const xs = useMemo<Props<V["x"]>["directions"]>(
    () => Object.entries(xPositionTitle) as [XPosition, string][],
    []
  );
  const ys = useMemo<Props<V["y"]>["directions"]>(
    () => Object.entries(yPositionTitle) as [YPosition, string][],
    []
  );
  return (
    <>
      <Direction<V["direction"]>
        label={t("Direction")}
        value={value.direction}
        onChange={onDirectionChange}
        directions={directions}
      />
      <Direction<V["x"]>
        label={t("X")}
        value={value.x}
        onChange={onXChange}
        directions={xs}
      />
      <Direction<V["y"]>
        label={t("Y")}
        value={value.y}
        onChange={onYChange}
        directions={ys}
      />
      <OptionWrapper className={"brz-ed-option"}>
        <OptionLabel label={t("Speed")} />
        <NumberSlider<"">
          value={{ number: speed, unit: "" }}
          onChange={({ number }) => handleSpeedChange(number)}
          step={1}
          min={-10}
          max={10}
          units={[]}
        />
      </OptionWrapper>
      <Viewport value={value.viewport} onChange={onViewportChange} />
    </>
  );
};
