import React from "react";
import { Transition } from "react-transition-group";
import classnames from "classnames";

const TRANSITION_DURATION = 150;

type TTransitionStyles = {
  left: {
    [k: string]: { transform: string } | undefined;
  };
  right: {
    [k: string]: { transform: string } | undefined;
  };
};
const transitionStyles: TTransitionStyles = {
  left: {
    exited: { transform: "translate3d(-100%, 0, 0)" },
    entering: { transform: "translate3d(-100%, 0, 0)" },
    entered: { transform: "translate3d(0, 0, 0)" }
  },
  right: {
    exited: { transform: "translate3d(100%, 0, 0)" },
    entering: { transform: "translate3d(100%, 0, 0)" },
    entered: { transform: "translate3d(0, 0, 0)" }
  }
};

type RightSidebarAnimationProps = {
  className: string;
  alignment: "left" | "right";
  play: boolean;
};
export const Animation: React.FC<RightSidebarAnimationProps> = ({
  className,
  alignment,
  play,
  children
}) => {
  return (
    <Transition in={play} timeout={TRANSITION_DURATION}>
      {(state: string): React.ReactNode => (
        <div
          className={classnames(className, {
            active: play
          })}
          style={{
            transition: `transform ${TRANSITION_DURATION}ms linear`,
            ...transitionStyles[alignment][state]
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  );
};
