import { mPipe } from "fp-utilities";
import React, { useCallback, useMemo } from "react";
import { NumberSlider } from "visual/component/Controls/NumberSlider";
import { Unit, Value } from "visual/component/Controls/NumberUnit/types";
import { Switch } from "visual/component/Controls/Switch";
import { OptionLabel } from "visual/component/OptionLabel";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { t } from "visual/utils/i18n";
import { sliderSizeClassName } from "visual/utils/options/utils/sliderSizeClassName";
import { FCC } from "visual/utils/react/types";
import * as Degree from "../Degree";
import { OnChange } from "../types";
import { EffectProps } from "../types/EffectProps";
import { Rotate as V } from "../types/Rotate";

const units: Unit<"°">[] = [
  {
    value: "°",
    title: "°"
  }
];

const unitsPx: Unit<"px">[] = [
  {
    value: "px",
    title: "px"
  }
];

export const Rotate: FCC<EffectProps<V>> = ({ value, onChange }) => {
  const { rotate3D } = value;

  const sliderSize = "short";

  const onRotateChange = useCallback<OnChange<number>>(
    (v) =>
      mPipe(Degree.fromNumber, (rotate) => onChange({ ...value, rotate }))(v),
    [value, onChange]
  );

  const onSwitchChange = useCallback<OnChange<boolean>>(
    (rotate3D) => onChange({ ...value, rotate3D }),
    [value, onChange]
  );

  const onRotateYChange = useCallback<OnChange<number>>(
    (v) =>
      mPipe(Degree.fromNumber, (rotateY) => onChange({ ...value, rotateY }))(v),
    [value, onChange]
  );

  const onRotateXChange = useCallback<OnChange<number>>(
    (v) =>
      mPipe(Degree.fromNumber, (rotateX) => onChange({ ...value, rotateX }))(v),
    [value, onChange]
  );

  const onRotatePerspectiveChange = useCallback<OnChange<number>>(
    (rotatePerspective) => onChange({ ...value, rotatePerspective }),
    [value, onChange]
  );

  const valueRotate = useMemo(
    (): Value<"°"> => ({ number: value.rotate, unit: "°" }),
    [value.rotate]
  );

  const valueRotateX = useMemo(
    (): Value<"°"> => ({ number: value.rotateX, unit: "°" }),
    [value.rotateX]
  );

  const valueRotateY = useMemo(
    (): Value<"°"> => ({ number: value.rotateY, unit: "°" }),
    [value.rotateY]
  );

  const valueRotatePerspective = useMemo(
    (): Value<"px"> => ({ number: value.rotatePerspective, unit: "px" }),
    [value.rotatePerspective]
  );

  const onChangeRotate = useCallback(
    ({ number }: { number: number }) => onRotateChange(number),
    [onRotateChange]
  );

  const onChangeRotateX = useCallback(
    ({ number }: { number: number }) => onRotateXChange(number),
    [onRotateXChange]
  );

  const onChangeRotateY = useCallback(
    ({ number }: { number: number }) => onRotateYChange(number),
    [onRotateYChange]
  );

  const onChangeRotatePerspective = useCallback(
    ({ number }: { number: number }) => onRotatePerspectiveChange(number),
    [onRotatePerspectiveChange]
  );

  return (
    <>
      <OptionWrapper className="brz-ed-option">
        <OptionLabel label={t("Rotation")} />
        <NumberSlider<"°">
          className={sliderSizeClassName(sliderSize)}
          value={valueRotate}
          onChange={onChangeRotate}
          step={1}
          min={-359}
          max={359}
          units={units}
        />
      </OptionWrapper>
      <OptionWrapper className="brz-ed-option">
        <OptionLabel label={t("3D Rotate")} />
        <Switch value={rotate3D} onChange={onSwitchChange} />
      </OptionWrapper>
      {rotate3D && (
        <>
          <OptionWrapper className="brz-ed-option">
            <OptionLabel label={t("RotateX")} />
            <NumberSlider<"°">
              className={sliderSizeClassName(sliderSize)}
              value={valueRotateX}
              onChange={onChangeRotateX}
              step={1}
              min={-359}
              max={359}
              units={units}
            />
          </OptionWrapper>
          <OptionWrapper className="brz-ed-option">
            <OptionLabel label={t("RotateY")} />
            <NumberSlider<"°">
              className={sliderSizeClassName(sliderSize)}
              value={valueRotateY}
              onChange={onChangeRotateY}
              step={1}
              min={-359}
              max={359}
              units={units}
            />
          </OptionWrapper>
          <OptionWrapper className="brz-ed-option">
            <OptionLabel label={t("Perspective")} />
            <NumberSlider<"px">
              className={sliderSizeClassName(sliderSize)}
              value={valueRotatePerspective}
              onChange={onChangeRotatePerspective}
              step={1}
              min={500}
              max={1000}
              units={unitsPx}
            />
          </OptionWrapper>
        </>
      )}
    </>
  );
};
