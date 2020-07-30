import React, { CSSProperties, FC, forwardRef, MouseEventHandler } from "react";
import classNames from "classnames";
import { WithClassName } from "visual/utils/options/attributes";
import * as Str from "visual/utils/string/specs";
import { getAttr, getHref, getTarget } from "./utils";
import { Type, empty as defaultType } from "./types/Type";
import { Target, empty as defaultTarget } from "./types/Target";

type Props = WithClassName & {
  style?: CSSProperties;
  target?: Target;
  rel?: string;
  href?: string;
  type?: Type;
  attr?: JSX.IntrinsicAttributes;
};

const preventDefault: MouseEventHandler = (e): void => e.preventDefault();

const _Link: FC<Props> = (
  {
    className,
    style,
    children,
    rel,
    target = defaultTarget,
    type = defaultType,
    href,
    attr = {}
  },
  ref
) => {
  const _className = classNames(
    "brz-a",
    { "brz-anchor": type === "anchor" },
    className
  );
  const _href = getHref(type, Str.mRead(href));
  const _target = getTarget(type, target);
  const attrs = getAttr(attr);

  return (
    <a
      className={_className}
      href={_href}
      target={_target}
      rel={rel === "on" ? "nofollow" : undefined}
      style={style}
      data-brz-link-type={type}
      onClick={preventDefault}
      {...attrs}
      ref={ref}
    >
      {children}
    </a>
  );
};

export const Link = forwardRef(_Link) as typeof _Link;
export default Link;
