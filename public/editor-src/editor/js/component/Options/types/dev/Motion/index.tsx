import React, { FC, useCallback, useMemo } from "react";
import { identity } from "underscore";
import { Group } from "visual/component/Controls/Group";
import { FatIconsGrid } from "visual/component/FatIconsGrid";
import { OptionWrapper } from "visual/component/OptionWrapper";
import * as Option from "visual/component/Options/Type";
import { OnChange } from "visual/component/Options/Type";
import { WithClassName } from "visual/utils/options/attributes";
import { DisabledIcon } from "./components/DisabledIcon";
import { Icon } from "./components/Icon";
import { Config } from "./types/Config";
import * as Patch from "./types/Patch";
import { Effect, EffectValue, Value, effects } from "./types/Value";
import { effectIcon, effectOptions, effectTitle } from "./utils";

export interface Props extends Option.Props<Value, Patch.Patch>, WithClassName {
  config?: Config;
}

export const Motion: FC<Props> = ({
  className,
  label,
  value,
  onChange,
  config
}) => {
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
