import React, { useCallback, useMemo } from "react";
import { unique } from "underscore";
import { Group } from "visual/component/Controls/Group";
import { ReloadButton } from "visual/component/Controls/ReloadButton";
import { FatIconsGrid } from "visual/component/FatIconsGrid";
import * as Option from "visual/component/Options/Type";
import { OnChange } from "visual/component/Options/Type";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { always, mPipe } from "visual/utils/fp";
import { t } from "visual/utils/i18n";
import { fromNumber, Zero } from "visual/utils/math/Positive";
import { WithClassName } from "visual/utils/options/attributes";
import { AttentionStyle } from "./components/AttentionStyle";
import { Delay } from "./components/Delay";
import { Direction } from "./components/Direction";
import { Duration } from "./components/Duration";
import { Icon } from "./components/Icon";
import { Switcher } from "./components/Switcher";
import { fromElementModel, toElementModel } from "./converters";
import * as Attention from "./types/effects/Attention";
import * as Fade from "./types/effects/Fade";
import {
  EffectType,
  effectTypeIcon,
  effectTypeTitle
} from "./types/EffectType";
import * as Value from "./types/Value";
import { setDelay } from "./types/WithDelay";
import { setDuration } from "./types/WithDuration";
import { setInfiniteAnimation } from "./types/WithInfiniteAnimation";
import {
  defaultEffects,
  getAttentionStyles,
  getDirections,
  onChangeDirection,
  valueToType
} from "./utils";

export interface Props extends Option.Props<Value.Value>, WithClassName {
  config?: {
    types?: EffectType[];
  };
}

export const Animation: React.FC<Props> & Option.OptionType<Value.Value> = ({
  label,
  value,
  onChange,
  className,
  config
}) => {
  const types = useMemo(
    (): EffectType[] =>
      unique([EffectType.None, ...(config?.types ?? defaultEffects)]),
    [config?.types]
  );
  const type = valueToType(types, value);
  const _changeType = useCallback<OnChange<EffectType>>(
    (v) => onChange(Value.setType(v, value)),
    [value]
  );
  const _changeDuration = useCallback<OnChange<number>>(
    mPipe(
      fromNumber,
      (v) => Value.isEffect(value) && onChange(setDuration(v, value))
    ),
    [value]
  );
  const _changeDelay = useCallback<OnChange<number>>(
    mPipe(
      fromNumber,
      (v) => Value.isEffect(value) && onChange(setDelay(v, value))
    ),
    [value]
  );

  const _changeInfiniteAnimation = useCallback<OnChange<boolean>>(
    () => Value.isEffect(value) && onChange(setInfiniteAnimation(value)),
    [value]
  );

  const _onReplay = useCallback<VoidFunction>(
    mPipe(
      always(value.duration),
      (v) => v + 0.00001,
      fromNumber,
      (v) => Value.isEffect(value) && onChange(setDuration(v, value))
    ),
    [value]
  );

  const valueOptions = useMemo(() => {
    switch (value.type) {
      case EffectType.None: {
        return null;
      }

      case EffectType.Attention: {
        const onChangeStyle: OnChange<Attention.Style> = (v) =>
          onChange(Attention.setStyle(v, value));
        return (
          <AttentionStyle
            styles={getAttentionStyles(type)}
            value={value.style}
            onChange={onChangeStyle}
          />
        );
      }

      case EffectType.Bounce:
      case EffectType.Rotate:
      case EffectType.Slide:
      case EffectType.Zoom: {
        return (
          <Direction
            directions={getDirections(type)}
            value={value.direction}
            onChange={onChangeDirection(value, onChange)}
          />
        );
      }
      case EffectType.Fade: {
        switch (value.direction) {
          case Fade.Direction.none:
            return (
              <Direction<Fade.Direction>
                directions={
                  getDirections(value.type) as Array<[Fade.Direction, string]>
                }
                value={value.direction}
                onChange={onChangeDirection(value, onChange)}
              />
            );
          case Fade.Direction.up:
          case Fade.Direction.down:
          case Fade.Direction.left:
          case Fade.Direction.right: {
            return (
              <>
                <Direction
                  directions={
                    getDirections(value.type) as Array<[Fade.Direction, string]>
                  }
                  value={value.direction}
                  onChange={onChangeDirection(value, onChange)}
                />
                {type === EffectType.Fade ? (
                  <Switcher
                    value={value.big}
                    onChange={() => onChange({ ...value, big: !value.big })}
                    label={t("Big")}
                  />
                ) : null}
              </>
            );
          }
        }
      }
    }
  }, [value, type]);

  return (
    <div className={className}>
      <OptionWrapper display={"block"} className={"brz-ed-option"}>
        {label}
        <FatIconsGrid>
          {types.map((v) => (
            <Icon<EffectType>
              key={v}
              id={v}
              active={type === v}
              icon={effectTypeIcon(v)}
              label={effectTypeTitle(v)}
              onClick={_changeType}
            />
          ))}
        </FatIconsGrid>
      </OptionWrapper>
      {type !== EffectType.None && (
        <>
          <OptionWrapper className={"brz-ed-option"}>
            <Group>
              {valueOptions}
              <Duration value={value.duration} onChange={_changeDuration} />
              <Delay value={value.delay} onChange={_changeDelay} />
              <Switcher
                value={value.infiniteAnimation}
                onChange={_changeInfiniteAnimation}
                label={t("Infinite Animation")}
              />
            </Group>
          </OptionWrapper>
          <OptionWrapper
            className={"brz-ed-option brz-justify-content-xs-center"}
          >
            {!value.infiniteAnimation && <ReloadButton onClick={_onReplay} />}
          </OptionWrapper>
        </>
      )}
    </div>
  );
};

Animation.defaultValue = {
  type: EffectType.None,
  duration: Zero,
  delay: Zero,
  infiniteAnimation: false
};
Animation.toElementModel = toElementModel;
Animation.fromElementModel = fromElementModel;
