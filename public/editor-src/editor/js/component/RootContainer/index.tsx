import classNames from "classnames";
import React, { ReactElement, ReactNode } from "react";
import {
  getCommonEditorMode,
  useEditorMode
} from "visual/providers/EditorModeProvider";

export interface Props {
  attr?: React.Attributes;
  className?: string;
  children: ReactNode;
}

export const RootContainer = (props: Props): ReactElement => {
  const { children, attr, className: _className } = props;
  const { mode } = useEditorMode();
  const type = getCommonEditorMode(mode);
  const className = classNames(
    "brz-root__container brz-reset-all",
    _className,
    { [`brz-root__container-${type}`]: type }
  );

  return (
    <div {...attr} className={className}>
      {children}
    </div>
  );
};
