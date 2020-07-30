import React, { CSSProperties, MouseEvent } from "react";
import _ from "underscore";
import classnames from "classnames";
import { editorIconUrl } from "visual/utils/icons";

export type EditorIconProps = {
  className?: string;
  icon?: string;
  style?: CSSProperties;
  onClick?: (e: MouseEvent<SVGElement>) => void;
};

const _EditorIcon: React.FC<EditorIconProps> = (props, ref) => {
  const {
    className: _className = "",
    icon = "nc-circle-add",
    style = {},
    onClick = _.noop
  } = props;
  const className = classnames("brz-icon-svg brz-ed-icon-svg", _className);

  return (
    <svg ref={ref} className={className} onClick={onClick} style={style}>
      <use xlinkHref={editorIconUrl(icon)} />
    </svg>
  );
};

export const EditorIcon = React.forwardRef(_EditorIcon);

export default EditorIcon;
