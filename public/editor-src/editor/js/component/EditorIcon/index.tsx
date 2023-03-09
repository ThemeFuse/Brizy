import Loadable from "@loadable/component";
import classnames from "classnames";
import React, { CSSProperties, MouseEvent, ReactElement } from "react";
import _ from "underscore";
import { editorIconUrl } from "visual/utils/icons";
import type { IconNames } from "./Icon";

export interface Props {
  className?: string;
  icon?: string;
  style?: CSSProperties;
  onClick?: (e: MouseEvent<SVGElement>) => void;
}

const LoadableIcon = Loadable(() => import("./Icon"));

const isType2 = (i: string): i is IconNames => i.startsWith("t2-");

const _PreviewIcon = (): null => null;

const _EditorIcon = (props: Props): ReactElement => {
  const {
    className: _className = "",
    icon = "nc-circle-add",
    style = {},
    onClick = _.noop
  } = props;

  const className = classnames(
    "brz-icon-svg brz-ed-icon-svg align-[initial]",
    _className
  );

  return isType2(icon) ? (
    <LoadableIcon
      name={icon}
      className={className}
      style={style}
      onClick={onClick}
    />
  ) : (
    <svg className={className} onClick={onClick} style={style}>
      <use xlinkHref={editorIconUrl(icon)} />
    </svg>
  );
};

export const EditorIcon = IS_EDITOR
  ? React.forwardRef(_EditorIcon)
  : _PreviewIcon;

export default EditorIcon;
