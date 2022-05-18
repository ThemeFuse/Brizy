import React, { JSXElementConstructor, useCallback, useMemo } from "react";
import { Rotate as V } from "../types/Rotate";
import { EffectProps } from "../types/EffectProps";
import { t } from "visual/utils/i18n";
import { OnChange } from "visual/component/Options/Type";
import { UnitSlider } from "./UnitSlider";
import { Direction, Props } from "./Direction";
import { Viewport } from "./Viewport";

export const Rotate: JSXElementConstructor<EffectProps<V>> = ({
  value,
  onChange
}) => {
  const onDirectionChange = useCallback<OnChange<V["direction"]>>(
    direction => onChange({ ...value, direction }),
    [value, onChange]
  );
  const onXChange = useCallback<OnChange<V["x"]>>(
    x => onChange({ ...value, x }),
    [value, onChange]
  );
  const onYChange = useCallback<OnChange<V["y"]>>(
    y => onChange({ ...value, y }),
    [value, onChange]
  );
  const onSpeedChange = useCallback<OnChange<V["speed"]>>(
    speed => onChange({ ...value, speed }),
    [value, onChange]
  );
  const onViewportChange = useCallback<OnChange<V["viewport"]>>(
    viewport => onChange({ ...value, viewport }),
    [value, onChange]
  );
  const directions = useMemo<Props<V["direction"]>["directions"]>(
    () => [
      ["left", t("Left")],
      ["right", t("Right")]
    ],
    []
  );
  const xs = useMemo<Props<V["x"]>["directions"]>(
    () => [
      ["left", t("Left")],
      ["center", t("Center")],
      ["right", t("Right")]
    ],
    []
  );
  const ys = useMemo<Props<V["y"]>["directions"]>(
    () => [
      ["top", t("Top")],
      ["center", t("Center")],
      ["bottom", t("Bottom")]
    ],
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
      <UnitSlider
        label={t("Speed")}
        value={value.speed}
        onChange={onSpeedChange}
      />
      <Viewport value={value.viewport} onChange={onViewportChange} />
    </>
  );
};
