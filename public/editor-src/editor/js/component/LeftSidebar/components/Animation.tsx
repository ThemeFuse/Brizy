import classnames from "classnames";
import React, { JSX } from "react";
import { Transition } from "visual/component/Transition";
import { TransitionPhase } from "visual/component/Transition/types";
import { FCC } from "visual/utils/react/types";
import { MValue } from "visual/utils/value";

const duration = 150;

const defaultStyle = {
  transition: `transform ${duration}ms linear`,
  transform: "translate3d(-100%, 0, 0)"
};

const transitionStyles: {
  [k in TransitionPhase]: MValue<Record<string, unknown>>;
} = {
  appear: { transform: "translate3d(-100%, 0, 0)" },
  appearActive: { transform: "translate3d(0, 0, 0)" },
  appearDone: { transform: "translate3d(0, 0, 0)" },
  enter: { transform: "translate3d(-100%, 0, 0)" },
  enterActive: { transform: "translate3d(0, 0, 0)" },
  enterDone: { transform: "translate3d(0, 0, 0)" },
  exit: undefined,
  exitActive: undefined,
  exitDone: undefined
};

interface Props {
  in?: boolean;
  appear?: boolean;
  exit?: boolean;
}

const SlideLeft: FCC<Props> = ({ in: inProp, children, appear, exit }) => (
  <Transition in={inProp} duration={duration} appear={appear} exit={exit}>
    {(states): JSX.Element => {
      const state = Object.keys(states).find(
        (k) => states[k as keyof typeof states]
      ) as MValue<TransitionPhase>;

      const className = classnames("brz-ed-sidebar__content", {
        active: inProp
      });

      return (
        <div
          className={className}
          style={{
            ...defaultStyle,
            ...transitionStyles[state ?? TransitionPhase.EXIT]
          }}
        >
          {children}
        </div>
      );
    }}
  </Transition>
);

export default SlideLeft;
