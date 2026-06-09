import Loadable from "@loadable/component";
import classnames from "classnames";
import { noop } from "es-toolkit";
import React, { CSSProperties, MouseEvent, Ref, forwardRef } from "react";
import { useConfig } from "visual/providers/ConfigProvider";
import { RenderFor } from "visual/providers/RenderProvider/RenderFor";
import { editorIconUrl } from "visual/utils/icons";
import type { IconNames } from "./Icon";

export interface Props {
  className?: string;
  icon?: string;
  style?: CSSProperties;
  onClick?: (e: MouseEvent<SVGElement>) => void;
}

interface LegacyProps extends Props {
  innerRef: Ref<HTMLDivElement>;
}

export const LoadableIcon = Loadable(() => import("./Icon"));

const isType2 = (i: string): i is IconNames => i.startsWith("t2-");

const _PreviewIcon = (): null => null;

const LegacyIcon = (props: LegacyProps) => {
  const { icon = "nc-circle-add", className, onClick, style, innerRef } = props;
  const config = useConfig();
  const { editorIcons } = config.urls ?? {};

  return (
    <svg
      className={className}
      onClick={onClick}
      style={style}
      ref={innerRef as Ref<SVGSVGElement>}
    >
      <use xlinkHref={editorIconUrl({ icon, url: editorIcons }, config)} />
    </svg>
  );
};

const _EditorIcon = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    className: _className = "",
    icon = "nc-circle-add",
    style = {},
    onClick = noop
  } = props;

  const className = classnames(
    "brz-icon-svg brz-ed-icon-svg",
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
    <LegacyIcon
      icon={icon}
      className={className}
      style={style}
      innerRef={ref}
      onClick={onClick}
    />
  );
});

export const EditorIcon = forwardRef<HTMLDivElement, Props>((props, ref) => (
  <RenderFor
    forEdit={<_EditorIcon {...props} ref={ref} />}
    forView={<_PreviewIcon />}
  />
));

export default EditorIcon;
