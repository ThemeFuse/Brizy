import React, { MouseEventHandler } from "react";
import _ from "underscore";
import classNames from "classnames";
import { editorIconUrl } from "visual/utils/icons";

type Props = {
  icon: string;
  className?: string;
  style?: object;
  onClick?: MouseEventHandler;
};

const _EditorIcon: React.FC<Props> = (
  { className: _className, icon = "nc-circle-add", style, onClick = _.noop },
  ref
) => {
  const className = classNames("brz-icon-svg brz-ed-icon-svg", _className);

  return (
    <svg ref={ref} className={className} onClick={onClick} style={style}>
      <use xlinkHref={editorIconUrl(icon)} />
    </svg>
  );
};

export const EditorIcon = React.forwardRef(_EditorIcon);

export default EditorIcon;
