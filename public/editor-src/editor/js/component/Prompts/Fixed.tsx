import classnames from "classnames";
import React, { useEffect, useMemo } from "react";
import { useTransitionState } from "react-transition-state";
import HotKeys from "visual/component/HotKeys";
import Portal from "visual/component/Portal";

type FixedProps = {
  children: JSX.Element;
  onClose: () => void;
  opened?: boolean;
  className?: string;
};

const Fixed = (props: FixedProps): JSX.Element => {
  const { className:_className, opened = false, children, onClose } = props;
  const [{ status, isMounted }, toggle] = useTransitionState({
    timeout: 150,
    mountOnEnter: true,
    unmountOnExit: true,
    preEnter: true
  });

  const className = classnames(
    "brz-ed-fixed",
    "brz-ed-fade",
    status,
    _className
  );

  useEffect(() => {
    toggle(opened);
  }, [opened, toggle]);

  const node = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return window.parent.document.body;
  }, []);

  return (
    <>
      {node && isMounted && (
        <Portal node={node}>
          <div className={className}>
            <HotKeys
              keyNames={["esc"]}
              id="key-helper-prompt-esc"
              onKeyUp={onClose}
            />
            <div className="brz-ed-fixed-overlay" onClick={onClose} />
            <div className="brz-ed-fixed-scroll">{children}</div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default Fixed;
