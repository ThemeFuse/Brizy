import React, { useCallback } from "react";
import { Switch } from "visual/component/Controls/Switch";
import { OptionLabel } from "visual/component/OptionLabel";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { t } from "visual/utils/i18n";
import { FCC } from "visual/utils/react/types";
import { OnChange } from "../types";
import { EffectProps } from "../types/EffectProps";
import { Scale as V } from "../types/Scale";
import { UnitSlider } from "./UnitSlider";

export const Scale: FCC<EffectProps<V>> = ({ value, onChange }) => {
  const onScaleXChange = useCallback<OnChange<V["scaleX"]>>(
    (scaleX) => onChange({ ...value, scaleX }),
    [value, onChange]
  );
  const onScaleYChange = useCallback<OnChange<V["scaleY"]>>(
    (scaleY) => onChange({ ...value, scaleY }),
    [value, onChange]
  );
  const onScaleXYChange = useCallback<OnChange<V["scaleXY"]>>(
    (scaleXY) => onChange({ ...value, scaleXY }),
    [value, onChange]
  );
  const onPreserveSizeChange = useCallback<OnChange<V["scalePreserveSize"]>>(
    (scalePreserveSize) => onChange({ ...value, scalePreserveSize }),
    [value, onChange]
  );

  return (
    <>
      <OptionWrapper className="brz-ed-option">
        <OptionLabel label={t("Preserve size")} />
        <Switch
          value={value.scalePreserveSize}
          onChange={onPreserveSizeChange}
        />
      </OptionWrapper>
      {value.scalePreserveSize ? (
        <UnitSlider
          label={t("Scale")}
          value={value.scaleXY}
          onChange={onScaleXYChange}
        />
      ) : (
        <>
          <UnitSlider
            label={t("ScaleX")}
            value={value.scaleX}
            onChange={onScaleXChange}
          />
          <UnitSlider
            label={t("ScaleY")}
            value={value.scaleY}
            onChange={onScaleYChange}
          />
        </>
      )}
    </>
  );
};
