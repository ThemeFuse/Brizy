import { identity } from "es-toolkit";
import React, { useCallback, useMemo } from "react";
import { Transform as Control } from "visual/component/Controls/Transform";
import { Config } from "visual/component/Controls/Transform/types/Config";
import { Patch as PatchType } from "visual/component/Controls/Transform/types/Patch";
import {
  Effect,
  EffectValueWithAnchor,
  EffectsWithAnchor,
  Value
} from "visual/component/Controls/Transform/types/Value";
import { OnChange, Props as OptionProps } from "visual/component/Options/Type";
import { WithClassName } from "visual/types/attributes";
import { pipe } from "visual/utils/fp";
import * as Patch from "visual/utils/options/Transform/types/Patch";

export interface Props extends OptionProps<Value, PatchType>, WithClassName {
  config?: Config;
}

export const Transform = ({
  className,
  label,
  value,
  onChange,
  config
}: Props): JSX.Element => {
  const { active } = value;
  const disabled = config?.disabled ?? [];

  const onCheck = useCallback<OnChange<Effect>>(
    (e) => onChange(Patch.enable(e, !value[e], active === e)),
    [value, onChange, active]
  );

  const onClick = useCallback<OnChange<Effect>>(
    (v) => pipe(Patch.active, onChange)(v),
    [onChange]
  );

  const onOptionChange = useMemo((): OnChange<
    EffectValueWithAnchor<EffectsWithAnchor>
  > => {
    return active
      ? (v): void =>
          onChange(Patch.eff(active, v as EffectValueWithAnchor<typeof active>))
      : identity;
  }, [active, onChange]);

  return (
    <Control
      className={className}
      label={label}
      disabled={disabled}
      value={value}
      onClick={onClick}
      onCheck={onCheck}
      onOptionChange={onOptionChange}
    />
  );
};
