import React from "react";
import { Transition } from "react-transition-group";

const duration = 150;

const defaultStyle = {
  transition: `transform ${duration}ms linear`,
  transform: "translate3d(-100%, 0, 0)"
};

const transitionStyles = {
  entering: { transform: "translate3d(-100%, 0, 0)" },
  entered: { transform: "translate3d(0, 0, 0)" }
};

type Props = {
  in?: boolean;
  appear?: boolean;
  unmountOnExit?: boolean;
};

const SlideLeft: React.FC<Props> = ({
  in: inProp,
  children,
  appear,
  unmountOnExit
}) => (
  <Transition
    in={inProp}
    timeout={duration}
    appear={appear}
    unmountOnExit={unmountOnExit}
  >
    {(state: keyof typeof transitionStyles): React.ReactNode => (
      <div
        className={`brz-ed-sidebar__content ${inProp ? "active" : ""}`}
        style={{
          ...defaultStyle,
          ...transitionStyles[state]
        }}
      >
        {children}
      </div>
    )}
  </Transition>
);

export default SlideLeft;
