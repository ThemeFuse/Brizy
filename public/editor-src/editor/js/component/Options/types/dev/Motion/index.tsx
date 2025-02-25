import { identity } from "es-toolkit";
import React, { useCallback, useMemo } from "react";
import { Group } from "visual/component/Controls/Group";
import { Icon } from "visual/component/Controls/common/Icon";
import { FatIconsGrid } from "visual/component/FatIconsGrid";
import { OptionWrapper } from "visual/component/OptionWrapper";
import * as Option from "visual/component/Options/Type";
import { OnChange } from "visual/component/Options/Type";
import { WithClassName } from "visual/types/attributes";
import { Config } from "visual/utils/options/Motion/types/Config";
import * as Patch from "visual/utils/options/Motion/types/Patch";
import {
  Effect,
  EffectValue,
  Value,
  effects
} from "visual/utils/options/Motion/types/Value";
import { effectIcon, effectTitle } from "visual/utils/options/Motion/utils";
import { effectOptions } from "./utils";

export interface Props extends Option.Props<Value, Patch.Patch>, WithClassName {
  config?: Config;
}

export const Motion = ({
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
    (x0: Effect) => onChange(Patch.active(x0)),
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
          {effects
            .filter((effect) => !disabled.includes(effect))
            .map((v) => (
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
            ))}
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
