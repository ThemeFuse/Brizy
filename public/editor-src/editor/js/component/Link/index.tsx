import classNames from "classnames";
import React, {
  CSSProperties,
  PropsWithChildren,
  ReactElement,
  Ref,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from "react";
import { useConfig } from "visual/providers/ConfigProvider";
import { useRender } from "visual/providers/RenderProvider";
import { WithClassName } from "visual/types/attributes";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { attachRef } from "visual/utils/react";
import { mRead } from "visual/utils/string/specs";
import { StoryAnchorAttribute } from "./types/Slide";
import { Target, empty as defaultTarget } from "./types/Target";
import { Type, empty as defaultType } from "./types/Type";
import { getAttr, getHref, getRel, getTarget } from "./utils";

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
    draggable?: boolean;
    ariaLabel?: string;
    onClick?: VoidFunction;
  }
>;

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
    id = "",
    draggable,
    ariaLabel,
    onClick
  }: Props,
  ref: Ref<HTMLAnchorElement>
): ReactElement => {
  const config = useConfig();

  const innerRef = useRef<HTMLAnchorElement>();
  const { renderType } = useRender();
  const _className = classNames(
    "brz-a",
    { "brz-anchor": type === "anchor" },
    className
  );
  const _href = getHref(type, mRead(href), renderType, config);
  const _target = getTarget(type, target);
  const attrs = getAttr(attr);
  const _rel = getRel(mRead(rel), _target);

  useEffect(() => {
    const node = innerRef.current;

    if (node) {
      // added native preventDefault
      // because some library like Google Tag Manager
      // attach onclick event before react events
      node.addEventListener("click", (e) => {
        e.preventDefault();
      });
    }
  }, []);

  const attributes = useMemo(
    () => ({
      ...(_href ? { href: _href } : {}),
      ...makeDataAttr({ name: "link-type", value: type }),
      ...slide,
      ...attrs,
      ...(id && { id }),
      ...(ariaLabel && { "aria-label": ariaLabel })
    }),
    [_href, type, slide, attrs, id, ariaLabel]
  );

  const handleAttachRef = useCallback(
    (v: HTMLAnchorElement | null): void => {
      attachRef(v, ref || null);
      attachRef(v, innerRef || null);
    },
    [ref, innerRef]
  );

  return (
    <a
      className={_className}
      target={_target}
      rel={_rel}
      style={style}
      ref={handleAttachRef}
      draggable={draggable}
      onClick={onClick}
      {...attributes}
    >
      {children}
    </a>
  );
};

export const Link = forwardRef(_Link) as typeof _Link;
export default Link;
