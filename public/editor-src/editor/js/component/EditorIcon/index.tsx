import Loadable from "@loadable/component";
import classnames from "classnames";
import { noop } from "es-toolkit";
import React, { CSSProperties, MouseEvent, RefObject, forwardRef } from "react";
import { Config } from "visual/global/Config";
import { useConfig } from "visual/global/hooks";
import { RenderFor } from "visual/providers/RenderProvider/RenderFor";
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

const _EditorIcon = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    className: _className = "",
    icon = "nc-circle-add",
    style = {},
    onClick = noop
  } = props;

  const config = useConfig() as Config;
  const { editorIcons } = config.urls;

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
    <svg
      className={className}
      onClick={onClick}
      style={style}
      ref={ref as RefObject<SVGSVGElement>}
    >
      <use xlinkHref={editorIconUrl({ icon, url: editorIcons })} />
    </svg>
  );
});

export const EditorIcon = forwardRef<HTMLDivElement, Props>((props, ref) => (
  <RenderFor
    forEdit={<_EditorIcon {...props} ref={ref} />}
    forView={<_PreviewIcon />}
  />
));

export default EditorIcon;
