import classnames from "classnames";
import { noop } from "es-toolkit";
import React, { useMemo } from "react";
import { CSSTransition } from "react-transition-group";
import HotKeys from "visual/component/HotKeys";
import Portal from "visual/component/Portal";

type FixedProps = {
  children: JSX.Element;
  onClose: () => void;
  opened?: boolean;
  className?: string;
};

const Fixed = (props: FixedProps): JSX.Element => {
  const { className: _className, opened, children, onClose } = props;
  const className = classnames("brz-ed-fixed", _className);

  const node = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return window.parent.document.body;
  }, []);

  return (
    <>
      {node && (
        <Portal node={node}>
          <CSSTransition in={opened} classNames="brz-ed-fade" timeout={150}>
            {opened ? (
              <div className={className}>
                <HotKeys
                  keyNames={["esc"]}
                  id="key-helper-prompt-esc"
                  onKeyUp={onClose}
                />
                <div className="brz-ed-fixed-overlay" onClick={onClose} />
                <div className="brz-ed-fixed-scroll">{children}</div>
              </div>
            ) : (
              <span />
            )}
          </CSSTransition>
        </Portal>
      )}
    </>
  );
};

Fixed.defaultProps = {
  className: "",
  opened: false,
  onClose: noop
};

export default Fixed;
