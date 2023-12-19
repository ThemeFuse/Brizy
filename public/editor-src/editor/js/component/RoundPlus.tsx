import classnames from "classnames";
import React, { ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";

interface Props {
  className?: string;
  icon?: string;
  onClick?: VoidFunction;
}

const RoundPlus = (props: Props): ReactElement => {
  const { className: _className, icon, onClick } = props;
  const className = classnames(_className, "floating-action-button");

  return (
    <div className={className} onClick={onClick}>
      {icon ? <EditorIcon icon={icon} /> : null}
    </div>
  );
};

export default RoundPlus;
