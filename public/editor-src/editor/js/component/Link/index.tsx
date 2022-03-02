import React, {
  CSSProperties,
  forwardRef,
  MouseEventHandler,
  PropsWithChildren,
  ReactElement,
  Ref
} from "react";
import classNames from "classnames";
import { WithClassName } from "visual/utils/options/attributes";
import * as Str from "visual/utils/string/specs";
import { getAttr, getHref, getRel, getTarget } from "./utils";
import { Type, empty as defaultType } from "./types/Type";
import { Target, empty as defaultTarget } from "./types/Target";
import { StoryAnchorAttribute } from "./types/Slide";

type Props = PropsWithChildren<
  WithClassName & {
    style?: CSSProperties;
    target?: Target;
    rel?: string;
    href?: string;
    slide?: StoryAnchorAttribute;
    type?: Type;
    attr?: JSX.IntrinsicAttributes;
    id?: string;
  }
>;

const preventDefault: MouseEventHandler = (e): void => e.preventDefault();

const _Link = (
  {
    className,
    style,
    children,
    rel,
    target = defaultTarget,
    type = defaultType,
    href,
    slide = {},
    attr = {},
    id = ""
  }: Props,
  ref: Ref<HTMLAnchorElement>
): ReactElement => {
  const _className = classNames(
    "brz-a",
    { "brz-anchor": type === "anchor" },
    className
  );
  const _href = getHref(type, Str.mRead(href));
  const _target = getTarget(type, target);
  const attrs = getAttr(attr);
  const _rel = getRel(Str.mRead(rel), _target);

  return (
    <a
      className={_className}
      href={_href}
      target={_target}
      rel={_rel}
      style={style}
      data-brz-link-type={type}
      onClick={preventDefault}
      {...slide}
      {...attrs}
      ref={ref}
      id={id}
    >
      {children}
    </a>
  );
};

export const Link = forwardRef(_Link) as typeof _Link;
export default Link;
