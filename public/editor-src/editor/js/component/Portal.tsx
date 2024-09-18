import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  className?: string;
  node: HTMLElement;
  children: ReactNode;
}

export default function Portal({
  className,
  node,
  children
}: PortalProps): JSX.Element | null {
  const elRef = useRef<HTMLElement | null>(null);

  // this is deliberately done in render instead of useState + useEffect
  // because useEffect is executed after render, which means that
  // for the initial render, the state would have been null and this
  // could break existent client code that doesn't expect it to be async
  if (elRef.current === null || elRef.current.parentElement !== node) {
    const el = node.ownerDocument.createElement("div");

    if (className) {
      el.className = className;
    }
    node.appendChild(el);

    elRef.current = el;
  }

  useEffect(() => {
    return () => {
      if (elRef.current) {
        node.removeChild(elRef.current);
      }
    };
  }, [node]);

  useEffect(() => {
    if (!elRef.current) {
      return;
    }

    if (className) {
      elRef.current.className = className;
    } else {
      elRef.current.removeAttribute("class");
    }
  }, [className]);

  return elRef.current ? createPortal(children, elRef.current) : null;
}
