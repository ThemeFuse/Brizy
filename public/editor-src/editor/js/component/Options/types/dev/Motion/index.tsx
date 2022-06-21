import React, { FC, useCallback, useMemo } from "react";
import { identity } from "underscore";
import { pipe } from "visual/utils/fp";
import * as Option from "visual/component/Options/Type";
import { WithClassName } from "visual/utils/options/attributes";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { FatIconsGrid } from "visual/component/FatIconsGrid";
import { Group } from "visual/component/Controls/Group";
import { Icon } from "./components/Icon";
import { DisabledIcon } from "./components/DisabledIcon";
import { effectIcon, effectOptions, effectTitle } from "./utils";
import {
  Value,
  fromElementModel,
  effects,
  Effect,
  EffectValue
} from "./types/Value";
import { OnChange } from "visual/component/Options/Type";
import * as Patch from "./types/Patch";
import { Config } from "./types/Config";

export interface Props extends Option.Props<Value, Patch.Patch>, WithClassName {
  config?: Config;
}

export const Motion: FC<Props> & Option.OptionType<Value, Patch.Patch> = ({
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
    e => onChange(Patch.enable(e, !value[e], active === e)),
    [value, onChange]
  );

  const onClick = useCallback<OnChange<Effect>>(pipe(Patch.active, onChange), [
    onChange
  ]);

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
          {effects.map(v =>
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

Motion.defaultValue = {
  active: undefined,
  vertical: undefined,
  horizontal: undefined,
  blur: undefined,
  mouseTrack: undefined,
  rotate: undefined,
  scale: undefined,
  mouseTilt: undefined,
  transparency: undefined
};

Motion.fromElementModel = fromElementModel;

Motion.toElementModel = Patch.toElementModel;
