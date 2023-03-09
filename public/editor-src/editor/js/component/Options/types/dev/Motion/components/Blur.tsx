import React, { JSXElementConstructor, useCallback, useMemo } from "react";
import { OnChange } from "visual/component/Options/Type";
import { t } from "visual/utils/i18n";
import { Blur as V } from "../types/Blur";
import { EffectProps } from "../types/EffectProps";
import { Direction, Props } from "./Direction";
import { UnitSlider } from "./UnitSlider";
import { Viewport } from "./Viewport";

export const Blur: JSXElementConstructor<EffectProps<V>> = ({
  value,
  onChange
}) => {
  const onDirectionChange = useCallback<OnChange<V["direction"]>>(
    (direction) => onChange({ ...value, direction }),
    [value, onChange]
  );
  const onLevelChange = useCallback<OnChange<V["level"]>>(
    (level) => onChange({ ...value, level }),
    [value, onChange]
  );
  const onViewportChange = useCallback<OnChange<V["viewport"]>>(
    (viewport) => onChange({ ...value, viewport }),
    [value, onChange]
  );
  const directions = useMemo<Props<V["direction"]>["directions"]>(
    () => [
      ["in", t("In")],
      ["out", t("Out")],
      ["inOut", t("In out")],
      ["outIn", t("Out In")]
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
        label={t("Level")}
        value={value.level}
        onChange={onLevelChange}
      />
      <Viewport value={value.viewport} onChange={onViewportChange} />
    </>
  );
};
