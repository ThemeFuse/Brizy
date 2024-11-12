import classNames from "classnames";
import React, { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import UIEvents from "visual/global/UIEvents";
import { AnimationEvents } from "visual/utils/animation";
import { FCC } from "visual/utils/react/types";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { Hover } from "./Hover";
import { getAnimations } from "./animations";
import { AnimationEmmitterInfo, HoverTarget } from "./types";
import {
  getHoverTarget,
  isMultiAnimation,
  setAttribute,
  setHoverOptions
} from "./utils";

interface Props {
  cssKeyframe: string;
  animationId: string;
  options?: OptionalEffectTiming;
  target?: HoverTarget;
  className?: string;
  isHidden?: boolean;
  isDisabledHover?: boolean;
  withoutWrapper?: boolean;
}

export const HoverAnimation: FCC<Props> = ({
  children,
  animationId,
  options = {},
  cssKeyframe,
  isHidden,
  className,
  target = "firstChild",
  isDisabledHover = false,
  withoutWrapper
}) => {
  const [animationIsRunning, setAnimationIsRunning] = useState(false);
  const parent = useRef<HTMLDivElement | null>(null);
  const controller = useRef<Hover | null>(null);
  const elementIsHovered = useRef<boolean>(false);
  const deviceMode = useRef<ResponsiveMode>("desktop");

  const ableToHover = useMemo(() => {
    return cssKeyframe !== "none" && !animationIsRunning && !isDisabledHover;
  }, [cssKeyframe, animationIsRunning, isDisabledHover]);

  const animationOptions = useMemo(() => {
    const {
      animation,
      extraOptions = {},
      reversibleAnimation = true
    } = getAnimations(cssKeyframe) ?? {};

    return {
      animation: !isMultiAnimation(animation) ? animation : undefined,
      multiAnimation: isMultiAnimation(animation) ? animation : undefined,
      options: { ...extraOptions, ...options },
      reversibleAnimation
    };
  }, [options, cssKeyframe]);

  useEffect(() => {
    const _setAnimationIsRunning = (data: AnimationEmmitterInfo): void => {
      if (data.animationId === animationId) {
        setAnimationIsRunning(data.animationIsRunning);
      }
    };

    const setDevice = (device: ResponsiveMode): void => {
      deviceMode.current = device;
    };

    UIEvents.on(AnimationEvents.entranceOn, _setAnimationIsRunning);
    UIEvents.on(AnimationEvents.entranceOff, _setAnimationIsRunning);
    UIEvents.on("deviceMode.change", setDevice);

    return () => {
      UIEvents.off(AnimationEvents.entranceOn, _setAnimationIsRunning);
      UIEvents.off(AnimationEvents.entranceOff, _setAnimationIsRunning);
      UIEvents.off("deviceMode.change", setDevice);
    };
  }, [animationId]);

  useEffect(() => {
    if (parent.current) {
      const _target = getHoverTarget(parent.current, target);
      if (_target) {
        controller.current = new Hover({
          target: _target,
          keyframes: animationOptions.animation ?? [],
          options: animationOptions.options
        });
      }
    }

    return () => {
      controller.current = null;
    };
  }, [animationOptions, target]);

  if (isHidden && withoutWrapper) return <>{children}</>;

  const _onMouseEnter = (e: MouseEvent<Element>): void => {
    const { options } = animationOptions;
    if (
      e.target instanceof Element &&
      e.target.closest(".brz-hover-animation__container") &&
      ableToHover &&
      deviceMode.current === "desktop" &&
      controller.current
    ) {
      controller.current.setEffectsOnMouseEnter(options);
      if (animationOptions.multiAnimation) {
        controller.current.startSequenceAnimation({
          keyframes: animationOptions.multiAnimation.multiAnimation ?? [],
          options: animationOptions.options
        });
      } else {
        controller.current.play("normal");
      }
      elementIsHovered.current = true;
    }
  };

  /*
     MouseLeave - does not see if you exit the element via the toolbar
     eventTarget - the pointing device entered to after mouseOut
  */

  const _onMouseOut = (e: MouseEvent<Element>): void => {
    const { options } = animationOptions;

    if (controller.current && elementIsHovered.current) {
      if (
        e.relatedTarget instanceof Element &&
        parent.current?.contains(e.relatedTarget)
      ) {
        return;
      }
      controller.current?.setEffectsOnMouseLeave(options);
      if (
        ableToHover &&
        deviceMode.current === "desktop" &&
        animationOptions.reversibleAnimation
      ) {
        if (animationOptions.multiAnimation) {
          const { keyframes, extraOptions } =
            animationOptions.multiAnimation.endAnimation;
          controller.current.endSequenceAnimation({
            keyframes,
            extraOptions,
            options: animationOptions.options
          });
        } else {
          controller.current.play("reverse");
        }
      }
      controller.current.cancelAllAnimations();
      elementIsHovered.current = false;
    }
  };

  const _classNames = classNames("brz-hover-animation__container", className);

  return (
    <div
      ref={parent}
      className={_classNames}
      onMouseOut={_onMouseOut}
      onMouseEnter={_onMouseEnter}
      data-brz-hover-animationid={animationId}
      data-brz-hover-options={setHoverOptions(animationOptions.options)}
      data-brz-hover-reversible={animationOptions.reversibleAnimation}
      {...setAttribute("data-brz-hover-target", target)}
      {...setAttribute("data-brz-hover-animation", animationOptions.animation)}
      {...setAttribute(
        "data-brz-hover-multianimation",
        animationOptions.multiAnimation
      )}
    >
      {children}
    </div>
  );
};
