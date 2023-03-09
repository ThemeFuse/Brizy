import React, { FC, useCallback, useMemo } from "react";
import { Value } from "./types/Value";
import * as V from "./types/Value";
import { Props as OptionProps } from "visual/component/Options/Type";
import { getIcon, toSpacingValue, unitSetter, valueSetter } from "./utils";
import { pipe } from "visual/utils/fp";
import { Spacing, Props as SP } from "visual/component/Controls/Spacing";
import { SpacingUnit } from "visual/component/Options/utils/SpacingUnit";
import { Edge } from "visual/component/Controls/Spacing/types";
import { Type } from "visual/component/Options/utils/Type";
import { WithConfig } from "visual/utils/options/attributes";
import { Config } from "./types/Config";
import { ToSpacingEdges } from "./types/ToSpacingEdges";

export interface Props extends OptionProps<Value>, WithConfig<Config> {}

export const Margin: FC<Props> = ({ value, onChange, label, config }) => {
  const edges = config?.edges ?? "all";
  type E = ToSpacingEdges<typeof edges>;
  const onType = useCallback(
    pipe((v: Type): Value => V.setType(v, value), onChange),
    [value, onChange]
  );

  const _value = useMemo<SP<SpacingUnit, E>["value"]>(
    () => toSpacingValue(edges, value) as SP<SpacingUnit, E>["value"],
    [value]
  );

  const onValue = useCallback<SP<SpacingUnit, E>["onValue"]>(
    pipe((e: Edge, v: number) => valueSetter(e)(v, value), onChange),
    [onChange, value]
  );

  const onUnit = useCallback<SP<SpacingUnit, E>["onUnit"]>(
    pipe((e: Edge, v: SpacingUnit) => unitSetter(e)(v, value), onChange),
    [onChange, value]
  );

  const units = useMemo<SP<SpacingUnit, E>["units"]>(
    () =>
      (config?.units ?? ["px", "%"]).map(value => ({
        value,
        title: value
      })),
    [config]
  );

  return (
    <Spacing
      label={label}
      type={value.type}
      value={_value}
      units={units}
      onType={onType}
      onValue={onValue}
      onUnit={onUnit}
      getIcon={getIcon}
      step={1}
      min={-100}
      max={100}
    />
  );
};
