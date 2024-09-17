import React from "react";
import { Group } from "visual/component/Controls/Group";
import { FatIconsGrid } from "visual/component/FatIconsGrid";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { FCC } from "visual/utils/react/types";
import { DisabledIcon } from "../common/DisabledIcon";
import { Icon } from "../common/Icon";
import { AnchorPoint } from "./components/AnchorPoint";
import type { Props } from "./types";
import { Effect } from "./types/Value";
import {
  effects,
  getEffectComponent,
  getEffectIcon,
  getEffectTitle,
  hasAnchorPoint
} from "./utils";

export const Transform: FCC<Props> = ({
  className,
  label,
  disabled,
  value,
  onClick,
  onCheck,
  onOptionChange
}) => {
  const { active } = value;

  const anchorValue = hasAnchorPoint(active) ? value["anchorPoint"] : undefined;
  const effectValue = active ? value[active] : undefined;
  const EffectComponent = active ? getEffectComponent(active) : undefined;

  return (
    <div className={className}>
      <OptionWrapper display="block" className="brz-ed-option">
        {label}
        <FatIconsGrid>
          {effects.map((v) =>
            disabled.includes(v) ? (
              <DisabledIcon
                key={v}
                icon={getEffectIcon(v)}
                label={getEffectTitle(v)}
              />
            ) : (
              <Icon<Effect>
                key={v}
                id={v}
                active={active === v}
                checked={!!value[v]}
                icon={getEffectIcon(v)}
                label={getEffectTitle(v)}
                onClick={onClick}
                onCheck={onCheck}
              />
            )
          )}
        </FatIconsGrid>
      </OptionWrapper>
      {effectValue && EffectComponent ? (
        <>
          <OptionWrapper className="brz-ed-option">
            <Group>
              <EffectComponent value={effectValue} onChange={onOptionChange} />
            </Group>
          </OptionWrapper>
          {active && anchorValue ? (
            <OptionWrapper className="brz-ed-option">
              <Group>
                <AnchorPoint value={anchorValue} onChange={onOptionChange} />
              </Group>
            </OptionWrapper>
          ) : null}
        </>
      ) : null}
    </div>
  );
};
