import React, { JSXElementConstructor, useCallback, useMemo } from "react";
import { OnChange } from "visual/component/Options/Type";
import { t } from "visual/utils/i18n";
import { EffectProps } from "visual/utils/options/Motion/types/EffectProps";
import { Vertical as V } from "visual/utils/options/Motion/types/Vertical";
import { Direction, Props } from "./Direction";
import { UnitSlider } from "./UnitSlider";
import { Viewport } from "./Viewport";

export const Vertical: JSXElementConstructor<EffectProps<V>> = ({
  value,
  onChange
}) => {
  const onDirectionChange = useCallback<OnChange<V["direction"]>>(
    (direction) => onChange({ ...value, direction }),
    [value, onChange]
  );
  const onSpeedChange = useCallback<OnChange<V["speed"]>>(
    (speed) => onChange({ ...value, speed }),
    [value, onChange]
  );
  const onViewportChange = useCallback<OnChange<V["viewport"]>>(
    (viewport) => onChange({ ...value, viewport }),
    [value, onChange]
  );
  const directions = useMemo<Props<V["direction"]>["directions"]>(
    () => [
      ["up", t("Up")],
      ["down", t("Down")]
    ],
    []
  );
  return (
    <>
      <Direction
        label={t("Direction")}
        value={value.direction}
        onChange={onDirectionChange}
        directions={directions}
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
