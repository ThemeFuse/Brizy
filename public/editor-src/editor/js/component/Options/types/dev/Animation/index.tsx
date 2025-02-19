import { uniq } from "es-toolkit";
import { pass } from "fp-utilities";
import React, { ReactElement, useCallback, useMemo } from "react";
import { Group } from "visual/component/Controls/Group";
import { ReloadButton } from "visual/component/Controls/ReloadButton";
import { FatIconsGrid } from "visual/component/FatIconsGrid";
import { OptionWrapper } from "visual/component/OptionWrapper";
import * as Option from "visual/component/Options/Type";
import { OnChange } from "visual/component/Options/Type";
import { WithClassName } from "visual/types/attributes";
import { always, mPipe } from "visual/utils/fp";
import { t } from "visual/utils/i18n";
import { fromNumber } from "visual/utils/math/Positive";
import {
  EffectType,
  effectTypeIcon,
  effectTypeTitle
} from "visual/utils/options/Animation/types/EffectType";
import * as Value from "visual/utils/options/Animation/types/Value";
import { setDelay } from "visual/utils/options/Animation/types/WithDelay";
import { setDuration } from "visual/utils/options/Animation/types/WithDuration";
import { setInfiniteAnimation } from "visual/utils/options/Animation/types/WithInfiniteAnimation";
import * as Attention from "visual/utils/options/Animation/types/effects/Attention";
import * as Fade from "visual/utils/options/Animation/types/effects/Fade";
import {
  defaultEffects,
  getDirections,
  onChangeDirection,
  valueToType
} from "visual/utils/options/Animation/utils";
import { AttentionStyle } from "./components/AttentionStyle";
import { Delay } from "./components/Delay";
import { Direction } from "./components/Direction";
import { Duration } from "./components/Duration";
import { Icon } from "./components/Icon";
import { Switcher } from "./components/Switcher";

export interface Props extends Option.Props<Value.Value>, WithClassName {
  config?: {
    minDuration?: number;
    maxDuration?: number;
    types?: EffectType[];
    replay?: boolean;
    infiniteAnimation?: boolean;
    delay?: boolean;
  };
}

export const Animation = ({
  label,
  value,
  onChange,
  className,
  config
}: Props): ReactElement => {
  const types = useMemo(
    (): EffectType[] =>
      uniq([EffectType.None, ...(config?.types ?? defaultEffects)]),
    [config?.types]
  );
  const replay = config?.replay ?? true;
  const type = valueToType(types, value);
  const delay = config?.delay ?? true;
  const infiniteAnimation = config?.infiniteAnimation ?? true;
  const minDuration = config?.minDuration ?? 0.0;
  const maxDuration = config?.maxDuration ?? 5.0;

  const _changeType = useCallback<OnChange<EffectType>>(
    (v) => onChange(Value.setType(v, value)),
    [value, onChange]
  );
  const _changeDuration = useCallback<OnChange<number>>(
    (v) =>
      mPipe(
        fromNumber,
        (v) => Value.isEffect(value) && onChange(setDuration(v, value))
      )(v),
    [value, onChange]
  );
  const _changeDelay = useCallback<OnChange<number>>(
    (v) =>
      mPipe(
        fromNumber,
        (v) => Value.isEffect(value) && onChange(setDelay(v, value))
      )(v),
    [value, onChange]
  );

  const _changeInfiniteAnimation = useCallback<OnChange<boolean>>(
    () => Value.isEffect(value) && onChange(setInfiniteAnimation(value)),
    [value, onChange]
  );

  const _onReplay = useCallback<VoidFunction>(
    () =>
      mPipe(
        always(value.duration),
        pass(() => replay),
        (v) => v + 0.00001,
        fromNumber,
        (v) => Value.isEffect(value) && onChange(setDuration(v, value))
      )(),
    [value, replay, onChange]
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
            styles={Attention.styles}
            value={value.style}
            onChange={onChangeStyle}
          />
        );
      }

      case EffectType.Wobble:
      case EffectType.Scale:
      case EffectType.Fill:
      case EffectType.Pulse:
      case EffectType.Rotate2:
      case EffectType.Skew:
      case EffectType.Buzz: {
        return (
          <Direction
            directions={getDirections(type)}
            value={value.direction}
            label={t("Style")}
            onChange={onChangeDirection(value, onChange)}
          />
        );
      }

      case EffectType.Bounce:
      case EffectType.Rotate:
      case EffectType.Slide:
      case EffectType.Move:
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
  }, [value, type, onChange]);

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
              <Duration
                min={minDuration}
                max={maxDuration}
                value={value.duration}
                onChange={_changeDuration}
              />
              {delay && <Delay value={value.delay} onChange={_changeDelay} />}
              {infiniteAnimation && (
                <Switcher
                  value={value.infiniteAnimation}
                  onChange={_changeInfiniteAnimation}
                  label={t("Infinite Animation")}
                />
              )}
            </Group>
          </OptionWrapper>
          {replay && !value.infiniteAnimation && (
            <OptionWrapper
              className={"brz-ed-option brz-justify-content-xs-center"}
            >
              <ReloadButton onClick={_onReplay} />
            </OptionWrapper>
          )}
        </>
      )}
    </div>
  );
};
