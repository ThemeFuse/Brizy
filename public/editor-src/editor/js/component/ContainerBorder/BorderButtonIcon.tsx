import classNames from "classnames";
import React, { useEffect } from "react";
import { TransitionState, useTransitionState } from "react-transition-state";
import EditorIcon from "visual/component/EditorIcon";

const transitionProps = {
  timeout: 150,
  mountOnEnter: true,
  unmountOnExit: true,
  preEnter: true
};

export function BorderButtonIcon(props: {
  icon: string;
  activeIcon: string;
  active: boolean;
}) {
  const { icon, activeIcon, active } = props;
  const [iconState, toggleInitialIcon] = useTransitionState({
    ...transitionProps,
    initialEntered: !active
  });
  const [activeIconState, toggleActiveIcon] = useTransitionState({
    ...transitionProps,
    initialEntered: active
  });

  useEffect(() => {
    toggleActiveIcon(active);
    toggleInitialIcon(!active);
  }, [active, toggleActiveIcon, toggleInitialIcon]);

  return (
    <>
      <Icon {...iconState} icon={icon} />
      <Icon {...activeIconState} icon={activeIcon} />
    </>
  );
}

interface IconProps extends TransitionState {
  icon: string;
}

function Icon(props: IconProps) {
  const { icon, status, isMounted } = props;
  const className = classNames("brz-ed-fade", status);

  return isMounted ? <EditorIcon className={className} icon={icon} /> : null;
}
