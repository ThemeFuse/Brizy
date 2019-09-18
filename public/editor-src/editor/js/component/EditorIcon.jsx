import React from "react";
import _ from "underscore";
import classnames from "classnames";
import { editorIconUrl } from "visual/utils/icons";

function EditorIcon(
  { className: _className = "", icon = "nc-circle-add", onClick = _.noop },
  ref
) {
  const className = classnames("brz-icon-svg", _className);

  return (
    <svg ref={ref} className={className} onClick={onClick}>
      <use xlinkHref={editorIconUrl(icon)} />
    </svg>
  );
}

export default React.forwardRef(EditorIcon);
