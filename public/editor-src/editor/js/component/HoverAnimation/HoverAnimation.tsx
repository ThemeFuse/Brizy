import React, {
  FC,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import UIEvents from "visual/global/UIEvents";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { AnimationEvents } from "../Animation/utils";
import { Hover } from "./Hover";
import getAnimation from "./animations";
import { AnimationEmmitterInfo } from "./types";
import { setHoverOptions } from "./utils";

interface Props {
  cssKeyframe: string;
  animationId: string;
  options?: KeyframeEffectOptions;
}

export const HoverAnimation: FC<Props> = ({
  children,
  animationId,
  options = {},
  cssKeyframe
}) => {
  const child = useRef<HTMLDivElement | null>(null);
  const parent = useRef<HTMLDivElement | null>(null);
  const controller = useRef<Hover | null>(null);
  const hoveredElement = useRef<boolean>(false);
  const [animationIsRunning, setAnimationIsRunning] = useState(false);
  const deviceMode = useRef<ResponsiveMode>("desktop");

  const ableToHover = useMemo(() => {
    return cssKeyframe !== "none" && !animationIsRunning;
  }, [cssKeyframe, animationIsRunning]);

  const animationOptions = useMemo(() => {
    const { animation, extraOptions } = getAnimation(cssKeyframe) ?? {};

    return {
      animation,
      options: { ...options, ...extraOptions }
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
  }, []);

  useEffect(() => {
    if (child.current) {
      controller.current = new Hover({
        child: child.current,
        keyframes: animationOptions.animation ?? [],
        options: animationOptions.options
      });
    }

    return () => {
      controller.current = null;
    };
  }, [cssKeyframe, animationOptions]);

  const _onMouseEnter = (e: MouseEvent<HTMLDivElement>): void => {
    const { options } = animationOptions;
    if (
      e.target instanceof HTMLElement &&
      e.target.closest(".brz-hover-animation__container") &&
      ableToHover &&
      deviceMode.current === "desktop"
    ) {
      controller.current?.setEffectsOnMouseEnter(options);
      controller.current?.play("normal");
      hoveredElement.current = true;
    }
  };

  /*
     MouseLeave - does not see if you exit the element via the toolbar
     eventTarget - the pointing device entered to after mouseOut
  */

  const _onMouseOut = (e: MouseEvent<HTMLDivElement>): void => {
    const { options } = animationOptions;
    if (controller.current && hoveredElement.current) {
      if (
        e.relatedTarget instanceof HTMLElement &&
        parent.current?.contains(e.relatedTarget)
      ) {
        return;
      }
      controller.current?.setEffectsOnMouseLeave(options);
      if (ableToHover && deviceMode.current === "desktop") {
        controller.current.play("reverse");
      }
      hoveredElement.current = false;
    }
  };

  const _cssKeyframes = useMemo(() => {
    return encodeURI(JSON.stringify(animationOptions.animation));
  }, [cssKeyframe]);

  return (
    <div
      onMouseEnter={_onMouseEnter}
      ref={parent}
      onMouseOut={_onMouseOut}
      className="brz-hover-animation__container"
      data-animationid={animationId}
      data-hover={_cssKeyframes}
      data-hover-options={setHoverOptions(animationOptions.options)}
    >
      <div className={"brz-hover-animation"} ref={child}>
        {children}
      </div>
    </div>
  );
};
