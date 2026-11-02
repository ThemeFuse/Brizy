import React, { type JSXElementConstructor, useCallback, useMemo } from "react";
import type { OnChange } from "visual/component/Options/Type";
import { t } from "visual/utils/i18n";
import type { EffectProps } from "visual/utils/options/Motion/types/EffectProps";
import type { MouseTrack as V } from "visual/utils/options/Motion/types/MouseTrack";
import { Direction, type Props } from "./Direction";
import { UnitSlider } from "./UnitSlider";

export const MouseTrack: JSXElementConstructor<EffectProps<V>> = ({
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
  const directions = useMemo<Props<V["direction"]>["directions"]>(
    () => [
      ["direct", t("Direct")],
      ["opposite", t("Opposite")]
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
    </>
  );
};
