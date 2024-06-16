import React, { ReactElement, useCallback, useMemo } from "react";
import { Props as SP, Spacing } from "visual/component/Controls/Spacing";
import { Edge } from "visual/component/Controls/Spacing/types";
import {
  Meta as OptionMeta,
  Props as OptionProps
} from "visual/component/Options/Type";
import { Meta } from "visual/utils/options/Margin/meta";
import { Config } from "visual/utils/options/Margin/types/Config";
import { ToSpacingEdges } from "visual/utils/options/Margin/types/ToSpacingEdges";
import { Value } from "visual/utils/options/Margin/types/Value";
import * as V from "visual/utils/options/Margin/types/Value";
import {
  getIcon,
  toSpacingValue,
  unitSetter,
  valueSetter
} from "visual/utils/options/Margin/utils";
import { WithConfig } from "visual/utils/options/attributes";
import { SpacingUnit } from "visual/utils/options/utils/SpacingUnit";
import { Type } from "visual/utils/options/utils/Type";

export interface Props
  extends OptionProps<Value>,
    OptionMeta<Meta>,
    WithConfig<Config> {}

export const Margin = ({
  value,
  onChange,
  label,
  config
}: Props): ReactElement => {
  const edges = config?.edges ?? "all";
  type E = ToSpacingEdges<typeof edges>;

  const _value = useMemo<SP<SpacingUnit, E>["value"]>(
    () => toSpacingValue(edges, value) as SP<SpacingUnit, E>["value"],
    [value, edges]
  );

  const onType = useCallback(
    (v: Type) => onChange(V.setType(v, value)),
    [value, onChange]
  );

  const onValue = useCallback<SP<SpacingUnit, E>["onValue"]>(
    (e: Edge, v: number, m) => onChange(valueSetter(e)(v, value), m),
    [onChange, value]
  );

  const onUnit = useCallback<SP<SpacingUnit, E>["onUnit"]>(
    (e: Edge, v: SpacingUnit) => onChange(unitSetter(e)(v, value)),
    [onChange, value]
  );

  const units = useMemo<SP<SpacingUnit, E>["units"]>(
    () =>
      (config?.units ?? ["px", "%"]).map((value) => ({
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
