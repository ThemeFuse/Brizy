import React, { useCallback, useMemo } from "react";
import { identity } from "underscore";
import { Group } from "visual/component/Controls/Group";
import { FatIconsGrid } from "visual/component/FatIconsGrid";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { Props as OptionProps } from "visual/component/Options/Type";
import { OnChange } from "visual/component/Options/Type";
import { DisabledIcon } from "visual/component/Options/types/dev/Motion/components/DisabledIcon";
import { Icon } from "visual/component/Options/types/dev/Motion/components/Icon";
import { pipe } from "visual/utils/fp";
import { Config } from "visual/utils/options/Transform/types/Config";
import * as Patch from "visual/utils/options/Transform/types/Patch";
import {
  Effect,
  EffectValue,
  Value,
  effects
} from "visual/utils/options/Transform/types/Value";
import { effectIcon, effectTitle } from "visual/utils/options/Transform/utils";
import { WithClassName } from "visual/utils/options/attributes";
import { effectOptions } from "./utils";

export interface Props extends OptionProps<Value, Patch.Patch>, WithClassName {
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
  const activeEffect = active ? value[active] : undefined;
  const EffectComponent = active && effectOptions(active);
  const onCheck = useCallback<OnChange<Effect>>(
    (e) => onChange(Patch.enable(e, !value[e], active === e)),
    [value, onChange, active]
  );

  const onClick = useCallback<OnChange<Effect>>(
    (v) => pipe(Patch.active, onChange)(v),
    [onChange]
  );

  const onOptionChange = useMemo((): OnChange<EffectValue<Effect>> => {
    return active
      ? (v): void =>
          onChange(Patch.eff(active, v as EffectValue<typeof active>))
      : identity;
  }, [active, onChange]);

  return (
    <div className={className}>
      <OptionWrapper display={"block"} className={"brz-ed-option"}>
        {label}
        <FatIconsGrid>
          {effects.map((v) =>
            disabled.includes(v) ? (
              <DisabledIcon
                key={v}
                icon={effectIcon(v)}
                label={effectTitle(v)}
              />
            ) : (
              <Icon<Effect>
                key={v}
                id={v}
                active={active === v}
                checked={!!value[v]}
                icon={effectIcon(v)}
                label={effectTitle(v)}
                onClick={onClick}
                onCheck={onCheck}
              />
            )
          )}
        </FatIconsGrid>
      </OptionWrapper>
      {activeEffect && EffectComponent ? (
        <OptionWrapper className={"brz-ed-option"}>
          <Group>
            <EffectComponent value={activeEffect} onChange={onOptionChange} />
          </Group>
        </OptionWrapper>
      ) : null}
    </div>
  );
};
