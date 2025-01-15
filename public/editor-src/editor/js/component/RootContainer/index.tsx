import classNames from "classnames";
import React, { ReactElement, ReactNode } from "react";
import {
  EditorMode,
  getCommonEditorMode
} from "visual/global/EditorModeContext";

export interface Props {
  attr?: React.Attributes;
  className?: string;
  children: ReactNode;
  editorMode: EditorMode;
}

export const RootContainer = (props: Props): ReactElement => {
  const { children, attr, className: _className } = props;
  const type = getCommonEditorMode(props.editorMode);
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
