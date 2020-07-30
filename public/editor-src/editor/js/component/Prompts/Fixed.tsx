import React, { ReactElement, ReactNode } from "react";
import _ from "underscore";
import { CSSTransition } from "react-transition-group";
import classnames from "classnames";
import HotKeys from "visual/component/HotKeys";
import Portal from "visual/component/Portal";

type FixedProps = {
  children: ReactNode;
  onClose: () => void;
  opened?: boolean;
  className?: string;
};

const Fixed: React.FC<FixedProps> = (props: FixedProps): ReactElement => {
  const { className: _className, opened, children, onClose } = props;
  const className = classnames("brz-ed-fixed", _className);

  return (
    <Portal node={window.parent.document.body}>
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
  );
};

Fixed.defaultProps = {
  className: "",
  opened: false,
  onClose: _.noop
};

export default Fixed;
